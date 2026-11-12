// Shared project diagrams (inline SVG drawn from documented facts) and About stats. Originally from design D: C's layout + a terminal accent, project diagrams (inline SVG drawn from documented facts),
// and motion (network background, typing line, counters, scroll reveals). Honors prefers-reduced-motion.
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- diagrams (facts from experience.md only) ----------
const box = (x, y, w, h, label, cls = 'n') => `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle">${label}</text></g>`;
const arrow = (x1, y1, x2, y2) => `<line class="ar" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#ah)"/>`;
const defs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#38bdf8"/></marker></defs>`;

const diagrams = {
  securecart: `<svg viewBox="0 0 600 300" role="img" aria-label="SecureCart architecture: internet through AWS WAF to an ALB in public subnets; app EC2 and encrypted RDS in private subnets; NAT gateway and a /32 bastion in public subnets">${defs}
    ${box(8, 70, 76, 38, 'Internet', 'n ext')}${box(8, 140, 76, 40, 'AWS WAF', 'n waf')}
    <rect class="vpc" x="104" y="12" width="488" height="276" rx="12"/><text class="lbl" x="118" y="32">Custom VPC 10.0.0.0/16 · 2 Availability Zones</text>
    <rect class="pub" x="118" y="44" width="150" height="232" rx="10"/><text class="lbl" x="128" y="62">Public subnets</text>
    <rect class="prv" x="284" y="44" width="294" height="232" rx="10"/><text class="lbl" x="294" y="62">Private subnets</text>
    ${box(136, 141, 114, 38, 'ALB')}${box(136, 82, 114, 38, 'NAT Gateway')}${box(136, 222, 114, 38, 'Bastion /32')}
    ${box(304, 141, 112, 38, 'App EC2')}${box(446, 141, 116, 38, 'RDS · KMS', 'n db')}
    ${arrow(46, 108, 46, 138)}${arrow(84, 160, 134, 160)}${arrow(250, 160, 302, 160)}${arrow(416, 160, 444, 160)}${arrow(250, 241, 302, 170)}${arrow(330, 139, 252, 106)}
    <text class="cap" x="300" y="202">app-sg ← alb-sg only</text><text class="cap" x="446" y="202">3306 ← app-sg only</text><text class="cap" x="300" y="100">egress via NAT</text></svg>`,
  foody: `<svg viewBox="0 0 560 170" role="img" aria-label="Foody Woody: visitor over HTTPS to CloudFront with WAF, Origin Access Control to a private S3 bucket">${defs}
    ${box(10, 65, 90, 40, 'Visitor', 'n ext')}${box(140, 65, 120, 40, 'CloudFront')}${box(140, 10, 120, 36, 'AWS WAF', 'n waf')}${box(300, 65, 110, 40, 'OAC')}${box(450, 65, 100, 40, 'Private S3', 'n db')}
    ${arrow(100, 85, 138, 85)}${arrow(200, 46, 200, 63)}${arrow(260, 85, 298, 85)}${arrow(410, 85, 448, 85)}
    <text class="cap" x="104" y="125">HTTPS only · GET/HEAD</text><text class="cap" x="300" y="125">bucket policy scoped to the distribution</text>
    <text class="cap" x="140" y="155">XSS-style payload → 403 Forbidden</text></svg>`,
  azuki: (() => {
    const steps = ['Phishing', 'Credential dump', 'RDP / SSH', 'PsExec', 'Exfiltration', 'Backup wipe', 'Ransomware'];
    return `<svg viewBox="0 0 560 150" role="img" aria-label="Azuki attack chain reconstructed with KQL">${defs}
      ${steps.map((t, i) => { const x = 8 + i * 79; return `<g class="step" data-d="${i * 0.18}"><circle cx="${x + 30}" cy="55" r="20"/><text class="num" x="${x + 30}" y="60" text-anchor="middle">${i + 1}</text><text class="cap" x="${x + 30}" y="98" text-anchor="middle">${t}</text></g>${i < steps.length - 1 ? arrow(x + 52, 55, x + 87, 55) : ''}`; }).join('')}
      <text class="lbl" x="8" y="135">8 days of attacker dwell time · 5 systems · 6 accounts · 27 ATT&amp;CK techniques</text></svg>`;
  })(),
  vuln: (() => {
    const rows = [['Total', 30, 6], ['Critical', 3, 0], ['High', 9, 1], ['Medium', 17, 4]];
    const W = 380;
    return `<svg viewBox="0 0 560 190" role="img" aria-label="Findings before and after remediation: total 30 to 6, critical 3 to 0, high 9 to 1, medium 17 to 4">
      ${rows.map(([k, a, b], i) => { const y = 14 + i * 42; return `<text class="cap" x="0" y="${y + 14}">${k}</text>
        <rect class="bar before" x="90" y="${y}" height="13" width="${(a / 30) * W}" data-d="${i * 0.12}"/><text class="cap" x="${96 + (a / 30) * W}" y="${y + 11}">${a}</text>
        <rect class="bar after" x="90" y="${y + 16}" height="13" width="${Math.max((b / 30) * W, 2)}" data-d="${0.5 + i * 0.12}"/><text class="cap" x="${96 + Math.max((b / 30) * W, 2)}" y="${y + 27}">${b}</text>`; }).join('')}
      <g class="legend"><rect class="before" x="90" y="176" width="12" height="10"/><text class="cap" x="108" y="185">First scan</text><rect class="after" x="190" y="176" width="12" height="10"/><text class="cap" x="208" y="185">After six scans</text></g></svg>`;
  })(),
  portfolio: `<svg viewBox="0 0 560 190" role="img" aria-label="This site: visitor over HTTPS to CloudFront, which adds security headers and serves a private S3 bucket through Origin Access Control; GitHub Actions checks every push">${defs}
    ${box(10, 75, 90, 40, 'Visitor', 'n ext')}${box(140, 75, 120, 40, 'CloudFront')}${box(130, 10, 140, 36, 'Headers policy', 'n waf')}${box(300, 75, 110, 40, 'OAC')}${box(450, 75, 100, 40, 'Private S3', 'n db')}
    ${arrow(100, 95, 138, 95)}${arrow(200, 46, 200, 73)}${arrow(260, 95, 298, 95)}${arrow(410, 95, 448, 95)}
    <text class="cap" x="290" y="32">CSP · HSTS · nosniff · frame DENY</text><text class="cap" x="104" y="135">TLS 1.2+ · HTTP/2 and HTTP/3 · ACM</text>
    <text class="cap" x="10" y="175">GitHub Actions: build → terraform validate → Checkov</text></svg>`,
  tor: `<svg viewBox="0 0 560 120" role="img" aria-label="Tor hunt timeline: silent install, browser launch, relay connection on port 9001, endpoint isolated">${defs}
    ${box(6, 35, 120, 40, 'Silent install /S')}${box(150, 35, 120, 40, 'Tor launched')}${box(294, 35, 120, 40, 'Relay :9001', 'n waf')}${box(438, 35, 116, 40, 'Isolated', 'n db')}
    ${arrow(126, 55, 148, 55)}${arrow(270, 55, 292, 55)}${arrow(414, 55, 436, 55)}
    <text class="cap" x="6" y="105">DeviceFileEvents → DeviceProcessEvents → DeviceNetworkEvents (KQL)</text></svg>`,
};
export const diagramFor = (name) => (/SecureCart/.test(name) ? diagrams.securecart : /Foody/.test(name) ? diagrams.foody : /Azuki/.test(name) ? diagrams.azuki : /Vulnerability/.test(name) ? diagrams.vuln : /Tor/.test(name) ? diagrams.tor : /Portfolio/.test(name) ? diagrams.portfolio : '');

export const stats = [
  [12, '+', 'SMB clients supported on AWS'],
  [200, '+', 'EC2 workloads supported'],
  [91, '', 'flags investigated in one threat hunt'],
  [80, '%', 'fewer findings after remediation'],
];
const typing = ['least-privilege IAM', 'segmented VPCs', 'detective controls with GuardDuty and Security Hub', 'threat hunts with KQL', 'vulnerability remediation'];
