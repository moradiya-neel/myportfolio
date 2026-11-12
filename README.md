# neelmoradiya.com

[![CI](https://github.com/moradiya-neel/myportfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/moradiya-neel/myportfolio/actions/workflows/ci.yml)

Source for my personal portfolio site, **[neelmoradiya.com](https://neelmoradiya.com)**: a static site I designed, built, and host on my own AWS account, with the infrastructure written in Terraform.

The site is small on purpose. The interesting part is how it is served: a private bucket, an edge that adds strict security headers, and a page that checks those headers on itself.

## Architecture

```
Visitor ──HTTPS (TLS 1.2+, HTTP/2 and HTTP/3)──▶ CloudFront ──Origin Access Control (SigV4)──▶ S3 (private)
                                   │
                                   ├─ CloudFront Function: www → apex redirect, folder index rewrite
                                   ├─ Response headers policy: CSP, HSTS, X-Frame-Options, and more
                                   └─ Access logs ──▶ S3 log bucket (90-day expiry)

DNS: Cloudflare (DNS only, not proxied) → CloudFront     Certificate: ACM, DNS-validated, us-east-1
```

## Security controls

| Layer | Control |
|---|---|
| Storage | S3 bucket is fully private (all four Block Public Access settings on), bucket-owner-enforced ownership, SSE-S3 encryption, versioning |
| Origin access | Bucket policy allows `s3:GetObject` only to this CloudFront distribution (Origin Access Control, `AWS:SourceArn` condition) |
| Transport | Bucket policy denies any request without TLS; CloudFront redirects HTTP to HTTPS with a minimum of TLSv1.2_2021 |
| Headers | Strict Content Security Policy (`default-src 'none'`, self-hosted scripts, styles and fonts only), HSTS with preload, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy, COOP and CORP; the `Server` header is removed |
| Logging | CloudFront standard logs to a separate encrypted bucket, expired after 90 days |
| Account guardrail | Terraform `allowed_account_ids` refuses to run against any account other than the one set in a local, uncommitted `terraform.tfvars` |
| Page | No third-party scripts, fonts, analytics, or trackers. Fonts are self-hosted (Space Grotesk, OFL) |

The "This site audits itself" section on the page sends a `HEAD` request to its own URL and shows which security headers came back, so anyone can see the controls working.

## CI and IaC scanning

Every push runs three GitHub Actions jobs: the site build, `terraform fmt` and `terraform validate`, and a [Checkov](https://www.checkov.io/) scan of the Terraform. Checkov passes 41 checks. Sixteen findings are accepted risks for a static personal site (for example, no WAF, no cross-region replication, SSE-S3 instead of KMS), and each is documented next to the resource with its reason. Any new finding fails the build.

## Project layout

| Path | What it is |
|---|---|
| `content.mjs` | All site text and facts in one place |
| `page.mjs` | HTML, CSS, and JavaScript for the page |
| `diagrams.mjs` | Inline SVG architecture diagrams for the project cards |
| `build.mjs` | Builds the deployable site into `site/` (cache-busted asset names, sitemap, robots.txt) |
| `infra/main.tf` | Terraform for S3, CloudFront, ACM, the security headers policy, and the edge function |
| `assets/fonts/` | Self-hosted Space Grotesk with its license |
| `.github/workflows/ci.yml` | Build, Terraform checks, and Checkov scan on every push |
| `newyear/` | A small standalone greeting page served at `/newyear/` |

## Build and preview

Requires Node.js 18 or newer. No dependencies to install.

```bash
node build.mjs
cd site && python3 -m http.server 8080 --bind 127.0.0.1
# open http://127.0.0.1:8080/
```

## Deploy

```bash
cd infra
echo 'allowed_account_ids = ["<your-account-id>"]' > terraform.tfvars   # not committed
terraform init
terraform apply -target=aws_acm_certificate.site   # add the printed validation CNAMEs in DNS
terraform apply

cd ..
node build.mjs
aws s3 sync site/ s3://<bucket-from-output> --delete
aws cloudfront create-invalidation --distribution-id <id-from-output> --paths "/*"
```

Credentials come from a dedicated, least-privilege deploy user, never from root.

## Roadmap

- Deploy from GitHub Actions using OIDC (no stored AWS keys)
- Remote Terraform state in S3 with locking

## License

Code: MIT. The Space Grotesk font is under the SIL Open Font License (see `assets/fonts/OFL-space-grotesk.txt`). Site text is my own and not covered by the code license.
