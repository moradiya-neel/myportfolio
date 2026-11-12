// Single source of site content.
// Rules: never name the healthcare client; labs are labs; no phone or home address; only verified claims.
export const site = {
  name: 'Neel Moradiya',
  fullName: 'Neelkumar Rameshbhai Moradiya',
  title: 'Cloud Security Engineer',
  location: 'New York, NY',
  tagline: 'I secure AWS environments: least-privilege IAM, network segmentation, encryption, logging and monitoring, and the documentation that keeps them that way.',
  about: [
    'I am a cloud security engineer focused on AWS. On my current contract I support the security and day-to-day management of a healthcare client’s AWS environment, covering identity and access, network security, encryption, logging, monitoring, backup, and recovery.',
    'Before that I spent 13 months as a Cloud Engineer at Diversity Infotech, building VPC architectures and supporting EC2 workloads for small and medium-sized businesses. I hold an MS in Cybersecurity from Yeshiva University, and I keep sharpening my detection and response skills through hands-on threat hunting labs with Microsoft Defender for Endpoint and KQL.',
  ],
  contact: {
    email: 'contact@neelmoradiya.com',
    linkedin: 'https://www.linkedin.com/in/moradiya-neel',
    github: 'https://github.com/moradiya-neel',
    resume: 'Neel_Moradiya_Resume.pdf',
  },
  certs: [
    { name: 'CompTIA Security+', note: 'Valid through Nov 2028' },
    { name: 'AWS Certified Cloud Practitioner', note: 'Valid through Dec 2028' },
  ],
  learning: ['AWS Certified Solutions Architect Associate', 'AWS Certified Security Specialty'],
  education: [
    { school: 'Yeshiva University, Katz School of Science and Health', degree: 'Master of Science in Cybersecurity', dates: '2024 – 2026', note: 'GPA 3.7. Degree conferred January 2026.' },
    { school: 'SRK University', degree: 'Bachelor of Computer Applications', dates: '2020 – 2023', note: '' },
  ],
  experience: [
    {
      role: 'AWS Cloud Security Engineer (Contract)', org: 'Independent Contractor, Confidential Healthcare Client', where: 'New York, NY', dates: 'Mar 2026 – Present',
      points: [
        'Design and maintain security controls across AWS covering IAM, network security, encryption, logging, monitoring, backup, and recovery.',
        'Implement and continuously review least-privilege IAM and separation of duties to reduce unnecessary access.',
        'Run detective controls with CloudTrail, CloudWatch alarms, GuardDuty, Security Hub, and AWS Config, and remediate misconfigurations and public exposure.',
        'Evaluate infrastructure changes for security risk and maintain architecture diagrams, procedures, and recovery runbooks.',
      ],
    },
    {
      role: 'Cloud Engineer', org: 'Diversity Infotech', where: 'Surat, India', dates: 'Dec 2022 – Dec 2023',
      points: [
        'Built 7+ custom AWS VPC architectures with public and private subnets, NAT, and controlled security group relationships for 12+ SMB clients.',
        'Supported 200+ EC2 workloads with load balancing, scaling, monitoring, and recovery.',
        'Managed IAM permissions and security controls across S3, RDS, and AWS Organizations; used CloudTrail and CloudWatch for investigation.',
        'Automated EC2 deployments with Terraform and scripted cloud tasks with Python; recommendations cut client costs by about 8%.',
      ],
    },
    {
      role: 'Cloud Infrastructure Intern', org: 'Diversity Infotech', where: 'Surat, India', dates: 'Sep 2022 – Nov 2022',
      points: ['Supported cloud deployment, user access, and monitoring; troubleshot connectivity and permission issues.'],
    },
  ],
  projects: [
    {
      name: 'SecureCart: AWS Security Architecture Redesign', kind: 'AWS lab', date: 'Aug 2026', repo: 'https://github.com/moradiya-neel/securecart-aws-security-architecture',
      summary: 'Took an intentionally insecure e-commerce stack (public EC2, internet-facing RDS, public S3) and rebuilt it as a segmented, private architecture.',
      highlights: ['Custom VPC across two AZs with private app and database tiers behind an ALB', 'Chained security groups and a /32-restricted bastion', 'Private, encrypted RDS; S3 Block Public Access and default encryption', 'AWS WAF managed rules validated against SQL injection payloads'],
      tags: ['VPC', 'IAM', 'ALB', 'RDS', 'KMS', 'AWS WAF'],
    },
    {
      name: 'Threat Hunt: The Azuki Breach Saga', kind: 'Threat hunting lab', date: 'Jan 2026', repo: 'https://github.com/moradiya-neel/threat-hunt-azuki-breach-saga',
      summary: 'Reconstructed a simulated eight-day ransomware intrusion end to end using KQL over endpoint telemetry.',
      highlights: ['91 flags investigated across four parts', '5 systems and 6 accounts traced, including 2 backdoor accounts', '27 MITRE ATT&CK techniques across 12 tactics', 'Timelines, IOC lists, and remediation plan'],
      tags: ['Defender for Endpoint', 'KQL', 'Log Analytics', 'MITRE ATT&CK'],
    },
    {
      name: 'Vulnerability Management Program', kind: 'Vulnerability management lab', date: 'Dec 2025', repo: 'https://github.com/moradiya-neel/vulnerability-management-program',
      summary: 'Ran a full program on Azure VMs: policy, credentialed scans, prioritization, change control, remediation, and risk acceptance.',
      highlights: ['Credentialed Tenable scans with just-in-time AD credentials', 'Total findings down 80% over six scans (30 to 6)', 'Critical findings down 100%, high down 89%', 'Documented risk acceptance for an unpatchable CVE'],
      tags: ['Tenable', 'PowerShell', 'Azure', 'Risk management'],
    },
    {
      name: 'Foody Woody: Secure Static Website', kind: 'AWS lab', date: 'Aug 2026', repo: 'https://github.com/moradiya-neel/foody-woody-secure-aws-website',
      summary: 'Served a static site from a private S3 bucket through CloudFront with Origin Access Control and AWS WAF.',
      highlights: ['Private bucket, OAC-scoped bucket policy', 'HTTPS redirect, GET and HEAD only', 'WAF managed rules blocked an XSS-style payload'],
      tags: ['S3', 'CloudFront', 'OAC', 'AWS WAF'],
    },
    {
      name: 'Threat Hunt: Unauthorized Tor Usage', kind: 'Threat hunting lab', date: 'Jan 2026', repo: 'https://github.com/moradiya-neel/tor-threat-hunting-scenario',
      summary: 'Built and hunted an insider-policy scenario on an Azure Windows 11 VM.',
      highlights: ['Found a silent Tor Browser install, launch, and relay connections on port 9001', 'Chronological timeline and response: endpoint isolated, manager notified'],
      tags: ['Defender for Endpoint', 'KQL'],
    },
  ],
  skills: [
    { group: 'Cloud security', items: ['AWS IAM and IAM Identity Center', 'Organizations and SCPs', 'VPC design and segmentation', 'KMS and encryption', 'AWS WAF', 'CloudFront with OAC', 'Secrets Manager'] },
    { group: 'Monitoring and detection', items: ['CloudTrail', 'CloudWatch', 'GuardDuty', 'Security Hub', 'AWS Config', 'Amazon Inspector', 'VPC Flow Logs'] },
    { group: 'Threat hunting and vulnerability', items: ['Microsoft Defender for Endpoint', 'KQL', 'Azure Log Analytics', 'Tenable (Nessus)', 'MITRE ATT&CK'] },
    { group: 'Automation and systems', items: ['Terraform', 'Python', 'PowerShell', 'Windows and Windows Server', 'Linux', 'Active Directory'] },
    { group: 'Frameworks', items: ['NIST CSF', 'CIS Benchmarks', 'OWASP Top 10', 'CVE/CWE', 'CVSS'] },
  ],
};
