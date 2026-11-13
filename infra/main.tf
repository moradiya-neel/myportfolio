terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.80" }
  }
}

variable "domain" { default = "neelmoradiya.com" }
variable "allowed_account_ids" {
  description = "AWS account(s) Terraform may touch. Set in terraform.tfvars (gitignored), never committed."
  type        = list(string)
}

variable "profile" {
  description = "Leave null and pass the portfolio session as env vars (aws configure export-credentials --profile <profile> --format env)"
  default     = null
}

provider "aws" {
  region  = "us-east-1" # CloudFront certificates must live in us-east-1
  profile = var.profile

  # Refuse to touch any account except the one in terraform.tfvars.
  allowed_account_ids = var.allowed_account_ids
  default_tags { tags = { Project = "portfolio", ManagedBy = "terraform" } }
}

data "aws_caller_identity" "me" {}

locals {
  names  = [var.domain, "www.${var.domain}"]
  bucket = "${replace(var.domain, ".", "-")}-site-${data.aws_caller_identity.me.account_id}"
}

# ---------- Site bucket: private, encrypted, versioned ----------
resource "aws_s3_bucket" "site" {
  bucket = local.bucket
  #checkov:skip=CKV_AWS_18:Bucket is reachable only through CloudFront (OAC); CloudFront access logs cover all reads
  #checkov:skip=CKV_AWS_144:Content is rebuilt from this repository; cross-region replication adds cost without benefit
  #checkov:skip=CKV_AWS_145:Public static content; SSE-S3 is sufficient and avoids KMS key policy and cost for OAC
  #checkov:skip=CKV2_AWS_61:A few small static files; noncurrent versions are kept on purpose for rollback
  #checkov:skip=CKV2_AWS_62:No downstream consumer for object events
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "site" {
  bucket = aws_s3_bucket.site.id
  rule { object_ownership = "BucketOwnerEnforced" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  versioning_configuration { status = "Enabled" }
}

# Only this CloudFront distribution may read the bucket (Origin Access Control).
resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "CloudFrontOAC"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.site.arn}/*"
        Condition = { StringEquals = { "AWS:SourceArn" = aws_cloudfront_distribution.site.arn } }
      },
      {
        Sid       = "DenyInsecureTransport"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource  = [aws_s3_bucket.site.arn, "${aws_s3_bucket.site.arn}/*"]
        Condition = { Bool = { "aws:SecureTransport" = "false" } }
      }
    ]
  })
}

# ---------- Log bucket for CloudFront access logs ----------
resource "aws_s3_bucket" "logs" {
  bucket = "${local.bucket}-logs"
  #checkov:skip=CKV_AWS_18:This is the log bucket; logging it to itself would loop
  #checkov:skip=CKV_AWS_21:Append-only access logs that expire after 90 days
  #checkov:skip=CKV_AWS_144:Short-lived access logs; replication adds cost without benefit
  #checkov:skip=CKV_AWS_145:SSE-S3 is used; SSE-KMS would need a customer managed key and key policy for log delivery
  #checkov:skip=CKV2_AWS_62:No downstream consumer for object events
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  bucket = aws_s3_bucket.logs.id
  #checkov:skip=CKV2_AWS_65:CloudFront standard logging writes through the log-delivery ACL, so ACLs must stay enabled here
  rule { object_ownership = "BucketOwnerPreferred" } # CloudFront standard logs need ACLs
}

resource "aws_s3_bucket_acl" "logs" {
  depends_on = [aws_s3_bucket_ownership_controls.logs]
  bucket     = aws_s3_bucket.logs.id
  acl        = "log-delivery-write"
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket                  = aws_s3_bucket.logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  #checkov:skip=CKV_AWS_300:CloudFront writes log files as single PUTs; no multipart uploads to abort
  bucket = aws_s3_bucket.logs.id
  rule {
    id     = "expire-logs"
    status = "Enabled"
    filter {}
    expiration { days = 90 }
  }
}

# ---------- TLS certificate (DNS-validated in Cloudflare) ----------
resource "aws_acm_certificate" "site" {
  domain_name               = var.domain
  subject_alternative_names = ["www.${var.domain}"]
  validation_method         = "DNS"
  lifecycle { create_before_destroy = true }
}

resource "aws_acm_certificate_validation" "site" {
  certificate_arn = aws_acm_certificate.site.arn
}

# ---------- CloudFront ----------
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${local.bucket}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_response_headers_policy" "security" {
  name = "portfolio-security-headers"
  security_headers_config {
    content_security_policy {
      content_security_policy = "default-src 'none'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests"
      override                = true
    }
    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    content_type_options { override = true }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }
  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
      override = true
    }
    items {
      header   = "Cross-Origin-Opener-Policy"
      value    = "same-origin"
      override = true
    }
    items {
      header   = "Cross-Origin-Resource-Policy"
      value    = "same-origin"
      override = true
    }
  }
  remove_headers_config {
    items { header = "Server" }
  }
}

# www -> apex redirect at the edge
resource "aws_cloudfront_function" "www_redirect" {
  name    = "portfolio-www-redirect"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-JS
    function handler(event) {
      var req = event.request;
      var host = req.headers.host && req.headers.host.value;
      if (host && host.indexOf('www.') === 0) {
        return { statusCode: 301, statusDescription: 'Moved Permanently',
                 headers: { location: { value: 'https://${var.domain}' + req.uri } } };
      }
      // Folder URLs (/folder or /folder/) serve that folder's index.html from S3.
      var uri = req.uri;
      if (uri.endsWith('/')) { req.uri = uri + 'index.html'; }
      else if (uri.split('/').pop().indexOf('.') === -1) { req.uri = uri + '/index.html'; }
      return req;
    }
  JS
}

data "aws_cloudfront_cache_policy" "optimized" { name = "Managed-CachingOptimized" }

resource "aws_cloudfront_distribution" "site" {
  #checkov:skip=CKV_AWS_68:Static site with GET/HEAD only, no forms or APIs; strict CSP instead of WAF, which costs more than the site
  #checkov:skip=CKV2_AWS_47:No WAF attached (see CKV_AWS_68); no server-side code, so Log4j does not apply
  #checkov:skip=CKV_AWS_310:Single-origin personal site; origin failover is not worth a second bucket
  #checkov:skip=CKV_AWS_374:Public portfolio meant to be reachable worldwide
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  default_root_object = "index.html"
  aliases             = local.names
  price_class         = "PriceClass_100"
  comment             = "Portfolio ${var.domain}"

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-site"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id           = "s3-site"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.www_redirect.arn
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 404
    response_page_path = "/index.html"
  }

  logging_config {
    bucket          = aws_s3_bucket.logs.bucket_domain_name
    include_cookies = false
    prefix          = "cloudfront/"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

# ---------- Outputs ----------
output "cert_validation_records" {
  description = "Add these CNAMEs in Cloudflare (DNS only, grey cloud)"
  value = [for o in aws_acm_certificate.site.domain_validation_options : {
    name  = o.resource_record_name
    value = o.resource_record_value
  }]
}
output "cloudfront_domain" { value = aws_cloudfront_distribution.site.domain_name }
output "distribution_id" { value = aws_cloudfront_distribution.site.id }
output "bucket" { value = aws_s3_bucket.site.bucket }
