// Design F: E plus ideas from security portfolios (Charan Reddy, Aleksei Aleinikov, Alex.dev): split hero with a live terminal,
// floating glass nav with a command palette, grid and glow background, labeled section titles, bento About.
// (Base notes from E:) modeled on the Figma and Adobe portfolio examples. One short sentence on the first screen,
// a slim top nav, then the work shown big. Reuses D's diagrams and stats. No inline script or style (strict-CSP ready).
import { diagramFor, stats } from './diagrams.mjs';

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function F(s) {
  let secNo = 0;
  const ICONS = { cloud: 'M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 9.2 4.5 4.5 0 0 0 7 18zM12 11v4m-2-2h4', radar: 'M12 12l6-6M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5', target: 'M12 2v4m0 12v4M2 12h4m12 0h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', term: 'M4 5h16v14H4zM7 9l3 3-3 3m5 0h5', layers: 'M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5M3 16l9 5 9-5', badge: 'M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5zm-3 10l2 2 4-4', cap: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5' };
  const icon = (g) => { const k = /Cloud/.test(g) ? 'cloud' : /Monitor/.test(g) ? 'radar' : /Threat/.test(g) ? 'target' : /Automation/.test(g) ? 'term' : /Framework/.test(g) ? 'layers' : /Cert/.test(g) ? 'badge' : 'cap'; return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[k]}"/></svg>`; };
  // Turn on only after https://securityheaders.com/?q=neelmoradiya.com really shows A+ for the live site.
  const headersVerified = !!s.securityHeadersVerified;
  const term = [
    ['whoami', ['neel moradiya · cloud security engineer · new york']],
    ['cat certifications.txt', ['CompTIA Security+', 'AWS Certified Cloud Practitioner']],
    ['ls projects/', ['securecart-aws/  azuki-threat-hunt/  vuln-mgmt-program/', 'foody-woody/  tor-threat-hunt/']],
    ['cat focus.txt', ['cloud security · AWS · detection and response']],
    ['echo $STATUS', ['open to cloud security roles']],
  ];
  const label = (word) => `<p class="label reveal"><i></i><b>${String(++secNo).padStart(2, '0')}</b></p><h2 class="title reveal">${word}</h2>`;
  const ext = (h) => (/^http/.test(h) ? ' target="_blank" rel="noopener"' : '');
  const a = (h, t, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${h}"${ext(h)}>${t}</a>`;
  const resume = './' + s.contact.resume;
  const siteUrl = 'https://neelmoradiya.com/';
  const ld = { '@context': 'https://schema.org', '@type': 'Person', name: s.name, jobTitle: s.title, url: siteUrl, address: { '@type': 'PostalAddress', addressLocality: 'New York', addressRegion: 'NY', addressCountry: 'US' }, alumniOf: 'Yeshiva University', sameAs: [s.contact.linkedin, s.contact.github] };

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(s.name)} | ${esc(s.title)}</title><meta name="description" content="${esc(s.tagline)}"><meta name="theme-color" content="#0a0f1c">
<meta property="og:type" content="profile"><meta property="og:title" content="${esc(s.name)} | ${esc(s.title)}"><meta property="og:description" content="${esc(s.tagline)}"><meta property="og:url" content="${siteUrl}"><meta property="og:image" content="${siteUrl}og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(s.name)}, ${esc(s.title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(s.name)} | ${esc(s.title)}"><meta name="twitter:description" content="${esc(s.tagline)}"><meta name="twitter:image" content="${siteUrl}og.png">
<link rel="canonical" href="${siteUrl}">
<link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="style.css"><script src="main.js" defer></script>
<script type="application/ld+json">${JSON.stringify(ld)}</script></head><body>
<a class="skip" href="#work">Skip to content</a><div id="progress" aria-hidden="true"></div>
<div class="bg" aria-hidden="true"><div class="grid"></div><canvas id="fx"></canvas><div class="cursor-light"></div><div class="glow g1"></div><div class="glow g2"></div><div class="glow g3"></div></div>
<header class="nav"><a class="logo" href="#top" aria-label="${esc(s.name)}, home"><i></i>neel<span>.sec</span></a>
<nav aria-label="Main"><a href="#work">Work</a><a href="#about">About</a><a href="#experience">Experience</a><a href="#contact">Contact</a></nav>
<div class="nav-r"><button class="kbtn" type="button" id="kopen" aria-label="Open quick navigation"><kbd>⌘K</kbd></button>${a(resume, 'Resume', 'btn small')}</div></header>

<section id="top" class="hero wrap">
<div class="hero-l"><p class="status rise"><i></i>Available for cloud security roles</p>
<h1 class="h1 rise">Neel<br><span class="grad">Moradiya</span></h1>
<p class="mono rise">Cloud Security Engineer · AWS · New York${headersVerified ? ' <a class="hdr" href="https://securityheaders.com/?q=neelmoradiya.com&followRedirects=on" target="_blank" rel="noopener">Security headers <b>A+</b> · verify it yourself ↗</a>' : ''}</p>
<p class="sub rise">I secure AWS environments: least-privilege access, segmented networks, and detective controls that catch problems <em>before</em> they become incidents.</p>
<p class="pills rise">${a('#work', 'View work →', 'btn')}${a('mailto:' + s.contact.email, 'Contact me', 'btn ghost')}</p>
<ul class="creds rise" aria-label="Credentials">${s.certs.map((c) => `<li>${esc(c.name)}</li>`).join('')}<li>MS Cybersecurity, Yeshiva University</li></ul></div>
<div class="hero-r rise"><div class="term" role="img" aria-label="Terminal showing Neel's role, certifications, projects, and status"><div class="tbar"><i></i><i></i><i></i><span>zsh · neel@secbox</span></div><pre id="tout" data-script='${esc(JSON.stringify(term))}'></pre></div></div></section>

<div class="palette" id="palette" hidden><div class="pbox" role="dialog" aria-modal="true" aria-label="Quick navigation"><input id="pq" type="text" placeholder="Jump to…" autocomplete="off" aria-label="Search sections and links"><ul id="plist"></ul><p class="phint"><kbd>↑</kbd><kbd>↓</kbd> to move · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close</p></div></div>

<main>
<section id="work" class="wrap">${label('Projects')}<div class="work">
${s.projects.map((p, i) => `<article class="proj reveal${i === 0 ? ' wide' : ''}" id="${esc(p.repo.split('/').pop())}">
<a class="shot" href="${p.repo}" target="_blank" rel="noopener" aria-label="${esc(p.name)} on GitHub">${diagramFor(p.name) ? `<figure class="fig">${diagramFor(p.name)}</figure>` : ''}</a>
<div class="pmeta"><span>${esc(p.kind)}</span><span>${esc(p.date)}</span></div>
<h3><a href="${p.repo}" target="_blank" rel="noopener">${esc(p.name.replace(/^([^:]+):\s*/, '$1 · '))}</a></h3>
<p>${esc(p.summary)}</p>
<details><summary>Details</summary><ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></details>
<div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div></article>`).join('')}
</div></section>

<div class="sep reveal" aria-hidden="true"><i></i></div>
<section id="about" class="wrap">${label('About')}
<div class="bento"><div class="tile lead reveal">${s.about.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
${stats.map(([n, suf, l]) => `<div class="tile stat reveal"><b data-count="${n}" data-suffix="${suf}">${n}${suf}</b><span>${l}</span></div>`).join('')}</div></section>

<div class="sep reveal" aria-hidden="true"><i></i></div>
<section id="experience" class="wrap">${label('Experience')}<div class="timeline">
${s.experience.map((e) => `<div class="job reveal"><div class="when">${esc(e.dates)}</div><div><h3>${esc(e.role)}</h3><div class="org">${esc(e.org)} · ${esc(e.where)}</div><ul>${e.points.slice(0, 3).map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div></div>`).join('')}
</div></section>

<div class="sep reveal" aria-hidden="true"><i></i></div>
<section id="skills" class="wrap">${label('Skills')}
<div class="marquee reveal" aria-hidden="true">${[0, 1].map((row) => { const items = s.skills.flatMap((g) => g.items).filter((_, i) => i % 2 === row); return `<div class="mrow${row ? ' rev' : ''}"><div class="mtrack">${[...items, ...items].map((t) => `<span>${esc(t)}</span>`).join('')}</div></div>`; }).join('')}</div>
<div class="skills2">
${s.skills.map((g) => `<div class="sk2 reveal"><div class="skh"><span class="ico">${icon(g.group)}</span><h3>${esc(g.group)}</h3><span class="cnt">${g.items.length}</span></div><p>${g.items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</p></div>`).join('')}
</div></section>

<div class="sep reveal" aria-hidden="true"><i></i></div>
<section id="credentials" class="wrap">${label('Credentials')}
<div class="creds2">
<div class="ccol"><h3 class="ch">Certifications</h3>
${s.certs.map((c) => `<div class="cert reveal"><span class="seal">${icon('Certifications')}</span><div><b>${esc(c.name)}</b><span class="iss">${esc(/CompTIA/.test(c.name) ? 'CompTIA' : 'Amazon Web Services')}</span><span class="valid">${esc(c.note)}</span></div>${c.verify ? `<a class="vfy" href="${c.verify}" target="_blank" rel="noopener">Verify ↗</a>` : ''}</div>`).join('')}
${s.learning.map((l) => `<div class="cert prog reveal"><span class="seal">${icon('Certifications')}</span><div><b>${esc(l)}</b><span class="iss">Amazon Web Services</span></div><span class="tag">In progress</span></div>`).join('')}</div>
<div class="ccol"><h3 class="ch">Education</h3>
${s.education.map((e) => `<div class="degree reveal"><span class="seal">${icon('Education')}</span><div><b>${esc(e.degree)}</b><span class="iss">${esc(e.school)}</span><span class="valid">${esc(e.dates)}${e.note ? ' · ' + esc(e.note) : ''}</span></div></div>`).join('')}</div>
</div></section>

<div class="sep reveal" aria-hidden="true"><i></i></div>
<section id="security" class="wrap">${label('Security')}
<p class="reveal audit-intro">The table below is not a claim. Your browser just asked this page for its own response headers, and this is what came back.</p>
<div class="audit reveal" id="audit" aria-live="polite"><p class="muted">Checking headers…</p></div></section>

<div class="sep reveal" aria-hidden="true"><i></i></div>
<section id="contact" class="wrap end"><p class="label reveal center"><i></i><b>07</b></p><h2 class="title reveal">Contact</h2><p class="cta-line reveal">Let's work together.</p>
<p class="reveal">${a('mailto:' + s.contact.email, s.contact.email, 'mail')}</p>
<p class="pills reveal">${a(s.contact.linkedin, 'LinkedIn', 'btn ghost')}${a(s.contact.github, 'GitHub', 'btn ghost')}${a(resume, 'Resume', 'btn ghost')}</p></section>
</main>
<footer class="wrap foot">© 2026 ${esc(s.name)}</footer></body></html>`;

  const css = `
:root{--bg:#0a0f1c;--panel:#111a2e;--fg:#e6ebf3;--muted:#8b97ad;--line:#1e2a44;--a1:#38bdf8;--a2:#818cf8;--ok:#4ade80}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.65 Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit}.skip{position:absolute;left:-999px;top:8px;z-index:30;background:var(--a1);color:#0a0f1c;padding:8px 14px;border-radius:8px;font-weight:600}.skip:focus{left:12px}
:focus-visible{outline:2px solid var(--a1);outline-offset:3px;border-radius:6px}
#progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:25;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,var(--a1),var(--a2))}
.nav{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:18px clamp(16px,4vw,48px);transition:background .3s,border-color .3s,padding .3s;border-bottom:1px solid transparent}
.scrolled .nav{background:rgba(10,15,28,.8);backdrop-filter:blur(10px);border-color:var(--line);padding-top:12px;padding-bottom:12px}
.logo{font-weight:800;letter-spacing:.04em;text-decoration:none;font-size:18px;background:linear-gradient(90deg,var(--a1),var(--a2));-webkit-background-clip:text;background-clip:text;color:transparent}
.nav nav{display:flex;gap:clamp(14px,3vw,32px)}.nav nav a{text-decoration:none;color:var(--muted);font-size:15px;transition:color .2s}.nav nav a:hover,.nav nav a.on{color:#fff}
.hero{position:relative;min-height:100vh;min-height:100svh;display:grid;place-items:center;text-align:center;overflow:hidden;padding:0 20px}
#net{position:absolute;inset:0;width:100%;height:100%;opacity:.7}.hero:after{content:'';position:absolute;inset:auto 0 0 0;height:30%;background:linear-gradient(transparent,var(--bg));pointer-events:none}
.hero-in{position:relative;z-index:1}
.h1{font-size:clamp(40px,7.2vw,92px);line-height:1.04;letter-spacing:-.035em;margin:0;font-weight:800;color:#fff}.grad{background:linear-gradient(90deg,var(--a1),var(--a2));-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{margin:26px 0 0;color:var(--muted);font-size:clamp(15px,1.6vw,18px);letter-spacing:.02em}
.rise{opacity:0;transform:translateY(24px);animation:rise .9s cubic-bezier(.2,.8,.2,1) forwards}.sub.rise{animation-delay:.25s}@keyframes rise{to{opacity:1;transform:none}}
.cue{position:absolute;bottom:34px;left:50%;transform:translateX(-50%);z-index:1;width:26px;height:42px;border:2px solid var(--muted);border-radius:14px}.cue span{position:absolute;left:50%;top:8px;width:4px;height:8px;margin-left:-2px;border-radius:2px;background:var(--fg);animation:cue 1.6s infinite}@keyframes cue{60%{transform:translateY(12px);opacity:0}100%{opacity:0}}
.wrap{max-width:1140px;margin:0 auto;padding:0 clamp(16px,4vw,32px)}main section{scroll-margin-top:40px}main>section.wrap{padding-top:112px}main>section.wrap:first-child{padding-top:96px}
h2{font-size:14px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin:0 0 36px;font-weight:600}
.work{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:40px 32px}.proj.wide{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);column-gap:40px;align-items:center}.proj.wide .shot{grid-row:1/span 6}.proj.wide .pmeta{margin-top:0}.proj.wide h3{font-size:28px}
.shot{display:block;border-radius:16px;background:var(--panel);border:1px solid var(--line);padding:22px;transition:transform .35s cubic-bezier(.2,.8,.2,1),border-color .3s,box-shadow .35s;overflow:hidden}
.shot:hover{transform:translateY(-4px);border-color:#34507f;box-shadow:0 18px 40px rgba(0,0,0,.35)}.fig{margin:0}.fig svg{width:100%;height:auto;display:block}
.pmeta{display:flex;justify-content:space-between;margin:18px 0 4px;color:var(--muted);font-size:13px;letter-spacing:.04em;text-transform:uppercase}
.proj h3{font-size:22px;margin:0 0 6px;letter-spacing:-.01em}.proj h3 a{text-decoration:none}.proj h3 a:hover{color:var(--a1)}.proj p{margin:0;color:#c3ccdb}
details{margin-top:10px}summary{cursor:pointer;color:var(--a1);font-size:14px;list-style:none}summary::-webkit-details-marker{display:none}summary:before{content:'+ '}details[open] summary:before{content:'− '}details ul{margin:8px 0 0;padding-left:18px;color:#c3ccdb;font-size:15px}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.tags span{font-size:12px;color:var(--a1);background:rgba(56,189,248,.1);padding:3px 10px;border-radius:999px}
.fig text{font:12px Inter,system-ui,sans-serif;fill:#cbd5e1}.fig .lbl,.fig .cap{fill:var(--muted);font-size:11px}
.fig .n rect{fill:#1a2846;stroke:#3b5280}.fig .ext rect{fill:#0e172b;stroke:#475569}.fig .waf rect{fill:rgba(129,140,248,.18);stroke:var(--a2)}.fig .db rect{fill:rgba(74,222,128,.12);stroke:#2f7a52}
.fig .vpc{fill:none;stroke:#3b5280;stroke-dasharray:5 4}.fig .pub{fill:rgba(56,189,248,.05);stroke:#2a4b6e}.fig .prv{fill:rgba(129,140,248,.05);stroke:#3b3f7a}
.fig .ar{stroke:var(--a1);stroke-width:1.6;stroke-dasharray:5 5;animation:flow 1.2s linear infinite}@keyframes flow{to{stroke-dashoffset:-20}}
.fig .step circle{fill:#1a2846;stroke:var(--a1);stroke-width:1.5}.fig .num{fill:#fff;font-weight:700}
.fig .bar{transform-origin:90px 0;transform:scaleX(0);transition:transform 1s cubic-bezier(.2,.8,.2,1);transition-delay:var(--d)}.reveal.in .fig .bar{transform:scaleX(1)}.fig .before{fill:#475569}.fig .after{fill:var(--ok)}
.fig .n,.fig .vpc,.fig .pub,.fig .prv,.fig .step{opacity:0;transform:translateY(6px);transition:opacity .45s,transform .45s;transition-delay:calc(var(--k,0) * 70ms)}.reveal.in .fig .n,.reveal.in .fig .vpc,.reveal.in .fig .pub,.reveal.in .fig .prv,.reveal.in .fig .step{opacity:1;transform:none}
.fig .ar{opacity:0;transition:opacity .5s;transition-delay:calc(var(--k,0) * 70ms + .4s)}.reveal.in .fig .ar{opacity:1}
.about{display:grid;grid-template-columns:1.4fr 1fr;gap:48px;align-items:start}.about p{margin:0 0 16px;color:#c3ccdb}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:14px}.stat{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px}.stat b{display:block;font-size:34px;line-height:1.1;color:#fff;letter-spacing:-.02em}.stat span{font-size:13px;color:var(--muted)}
.pills{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.btn{display:inline-block;padding:10px 18px;border-radius:999px;text-decoration:none;font-size:15px;font-weight:600;background:linear-gradient(90deg,var(--a1),var(--a2));color:#0a0f1c;transition:transform .2s,box-shadow .2s}.btn:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(56,189,248,.25)}
.btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line)}.btn.ghost:hover{border-color:var(--a1);box-shadow:none}
.timeline{position:relative;border-left:2px solid var(--line);margin-left:6px}.timeline:after{content:'';position:absolute;left:-2px;top:0;width:2px;height:calc(100% * var(--p,0));background:linear-gradient(var(--a1),var(--a2))}
.job{display:grid;grid-template-columns:180px 1fr;gap:24px;padding:0 0 40px 28px;position:relative}.job:before{content:'';position:absolute;left:-8px;top:8px;width:12px;height:12px;border-radius:50%;background:var(--bg);border:2px solid var(--line);transition:all .4s;z-index:1}.job.lit:before{background:var(--a1);border-color:var(--a1);box-shadow:0 0 0 5px rgba(56,189,248,.18)}
.when{color:var(--muted);font-size:14px;padding-top:2px}.job h3{margin:0;font-size:19px}.org{color:var(--muted);font-size:15px;margin:2px 0 8px}.job ul{margin:0;padding-left:18px;color:#c3ccdb;font-size:16px}.job li{margin:3px 0}
.skills{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px 32px}.sk h3{margin:0 0 10px;font-size:16px}.sk p{margin:0 0 10px}
.chip{display:inline-block;margin:0 6px 8px 0;font-size:13px;border:1px solid var(--line);padding:4px 11px;border-radius:999px;color:#cfd7e6}.chip.strong{border-color:#2f5a86;color:#fff}.muted{color:var(--muted);font-size:14px}
.end{text-align:center;padding-bottom:40px}.big{font-size:clamp(36px,6vw,72px);text-transform:none;letter-spacing:-.03em;color:#fff;font-weight:800;margin:0 0 18px}.mail{font-size:clamp(18px,2.4vw,26px);color:var(--a1);text-decoration:none;border-bottom:1px solid rgba(56,189,248,.35)}.mail:hover{border-color:var(--a1)}.end .pills{justify-content:center}
.foot{color:var(--muted);font-size:13px;padding-top:48px;padding-bottom:40px;text-align:center}
.reveal{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--i,0) * 90ms)}.reveal.in{opacity:1;transform:none}
@media(max-width:860px){.work,.about,.skills,.proj.wide{grid-template-columns:minmax(0,1fr)}.proj.wide{display:block}.proj.wide .pmeta{margin-top:18px}.job{grid-template-columns:1fr;gap:4px}.nav nav a[href$=".pdf"]{display:none}.fig{overflow-x:auto}.fig svg{min-width:520px}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rise,.reveal{opacity:1;transform:none}.fig .bar{transform:none}.fig .n,.fig .vpc,.fig .pub,.fig .prv,.fig .step,.fig .ar{opacity:1;transform:none}#net{display:none}.timeline{--p:1!important}}`;

  const cssF = `
@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:500;font-display:swap;src:url(./assets/fonts/space-grotesk-latin-500.woff2) format('woff2')}
@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:600;font-display:swap;src:url(./assets/fonts/space-grotesk-latin-600.woff2) format('woff2')}
@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:700;font-display:swap;src:url(./assets/fonts/space-grotesk-latin-700.woff2) format('woff2')}
.h1,.title,.big,.cta-line,.proj h3,.tile.stat b,.job h3,.sk2 h3,.cert b,.degree b,.contact-card h3{font-family:'Space Grotesk',Inter,system-ui,sans-serif}
.h1{font-weight:700;letter-spacing:-.03em}.title{font-weight:600;letter-spacing:-.02em;font-size:clamp(34px,4.4vw,52px)}.proj h3,.job h3,.sk2 h3{font-weight:600;letter-spacing:-.01em}.tile.stat b{font-weight:600}
.end .title{margin-bottom:10px}.cta-line{font-size:clamp(22px,3vw,32px);font-weight:500;color:#cbd5e1;margin:0 0 22px;letter-spacing:-.01em}
.sep{position:relative;max-width:1076px;height:1px;margin:104px auto 0;padding:0 32px}.sep:before,.sep:after{content:'';position:absolute;top:0;height:1px;width:calc(50% - 40px);transition:transform 1.1s cubic-bezier(.2,.8,.2,1) .1s}
.sep:before{right:50%;margin-right:12px;background:linear-gradient(90deg,transparent,rgba(56,189,248,.55));transform-origin:100% 50%;transform:scaleX(0)}.sep:after{left:50%;margin-left:12px;background:linear-gradient(90deg,rgba(129,140,248,.55),transparent);transform-origin:0 50%;transform:scaleX(0)}
.sep.in:before,.sep.in:after{transform:scaleX(1)}.sep i{position:absolute;left:50%;top:-4px;width:9px;height:9px;margin-left:-4.5px;border-radius:50%;background:var(--a1);box-shadow:0 0 0 4px rgba(56,189,248,.12),0 0 14px rgba(56,189,248,.8)}
.sep.in i{animation:node 2.6s ease-in-out infinite}@keyframes node{50%{box-shadow:0 0 0 7px rgba(56,189,248,.06),0 0 22px rgba(56,189,248,1)}}
.sep.reveal{opacity:1;transform:none}main>.sep+section.wrap{padding-top:88px}
@media(prefers-reduced-motion:reduce){.sep:before,.sep:after{transform:none}}
.creds2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:32px}.ch{font:12px ui-monospace,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin:0 0 14px;font-weight:500}
.cert,.degree{display:flex;align-items:center;gap:16px;padding:18px 20px;margin-bottom:14px;border-radius:16px;border:1px solid var(--line);background:rgba(14,21,38,.85);transition:transform .25s,border-color .25s,box-shadow .25s}
.cert:hover,.degree:hover{transform:translateY(-2px);border-color:#34507f;box-shadow:0 12px 30px rgba(0,0,0,.3)}
.cert>div,.degree>div{flex:1;min-width:0}.cert b,.degree b{display:block;color:#fff;font-size:16px}.iss{display:block;color:#c3ccdb;font-size:14px}.valid{display:block;color:var(--muted);font-size:13px;margin-top:2px}
.seal{flex:none;width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(56,189,248,.18),rgba(129,140,248,.18));border:1px solid rgba(56,189,248,.35);box-shadow:inset 0 0 18px rgba(56,189,248,.12)}.seal svg{width:24px;height:24px;fill:none;stroke:var(--a1);stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.cert:not(.prog) .seal{animation:sealglow 4s ease-in-out infinite}@keyframes sealglow{50%{box-shadow:inset 0 0 18px rgba(56,189,248,.12),0 0 18px rgba(56,189,248,.25)}}
.cert.prog{border-style:dashed;background:rgba(14,21,38,.5)}.cert.prog .seal{background:transparent;border-style:dashed;box-shadow:none}.cert.prog .seal svg{stroke:var(--muted)}.cert.prog b{color:#cbd5e1}
.tag{font:11px ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:#fbbf24;border:1px solid rgba(251,191,36,.35);border-radius:999px;padding:3px 9px;white-space:nowrap}
.vfy{font-size:13px;color:var(--a1);text-decoration:none;border:1px solid var(--line);border-radius:8px;padding:4px 10px}.vfy:hover{border-color:var(--a1)}
.degree .seal{background:linear-gradient(135deg,rgba(74,222,128,.15),rgba(56,189,248,.12));border-color:rgba(74,222,128,.35)}.degree .seal svg{stroke:var(--ok)}
@media(max-width:860px){.creds2{grid-template-columns:minmax(0,1fr)}.cert{position:relative}.cert.prog{padding-top:44px}.cert.prog .tag{position:absolute;top:14px;right:14px}}
#fx{position:absolute;inset:0;width:100%;height:100%;mask-image:radial-gradient(ellipse at 50% 30%,#000 35%,transparent 85%);-webkit-mask-image:radial-gradient(ellipse at 50% 30%,#000 35%,transparent 85%)}
.cursor-light{position:absolute;inset:0;background:radial-gradient(380px circle at var(--cx,50%) var(--cy,-20%),rgba(56,189,248,.10),transparent 60%);transition:background .1s}
.marquee{display:grid;gap:12px;margin:0 0 36px;mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);overflow:hidden}
.mrow{overflow:hidden}.mtrack{display:flex;gap:12px;width:max-content;animation:marq 48s linear infinite}.mrow.rev .mtrack{animation-direction:reverse;animation-duration:56s}.marquee:hover .mtrack{animation-play-state:paused}
.mtrack span{white-space:nowrap;font:14px ui-monospace,SFMono-Regular,Menlo,monospace;color:#cbd5e1;padding:9px 16px;border:1px solid var(--line);border-radius:999px;background:rgba(17,26,46,.6)}.mtrack span:nth-child(3n){color:var(--a1)}.mtrack span:nth-child(5n){color:var(--ok)}
@keyframes marq{to{transform:translateX(-50%)}}
@property --ang{syntax:'<angle>';inherits:false;initial-value:0deg}
.skills2{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.sk2{position:relative;border-radius:18px;padding:22px;border:1px solid transparent;background:linear-gradient(rgba(14,21,38,.92),rgba(14,21,38,.92)) padding-box,conic-gradient(from var(--ang),var(--line),var(--line) 60%,var(--a1) 75%,var(--a2) 85%,var(--line) 100%) border-box;transition:transform .3s}
.sk2:hover{transform:translateY(-3px);animation:spin 3s linear infinite}@keyframes spin{to{--ang:360deg}}
.skh{display:flex;align-items:center;gap:12px;margin-bottom:14px}.skh h3{margin:0;font-size:16px;flex:1}.ico{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.25)}.ico svg{width:20px;height:20px;fill:none;stroke:var(--a1);stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.cnt{font:12px ui-monospace,Menlo,monospace;color:var(--muted);border:1px solid var(--line);border-radius:6px;padding:1px 7px}
.sk2 p{margin:0}.sk2 .chip{opacity:0;transform:translateY(6px) scale(.92);transition:opacity .35s ease,transform .35s ease,border-color .2s,color .2s;transition-delay:calc(var(--c,0) * 45ms + .15s)}.reveal.in .chip{opacity:1;transform:none}.sk2 .chip:hover{border-color:var(--a1);color:#fff}
.wide2 .edu{display:grid;grid-template-columns:1fr 1fr;gap:12px}.wide2 .edu p{margin:0}
@media(min-width:861px){.wide2{grid-column:span 2}}
@media(max-width:860px){.skills2{grid-template-columns:minmax(0,1fr)}.wide2 .edu{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.mtrack{animation:none}.sk2 .chip{opacity:1;transform:none}#fx{display:none}}
.audit-intro{color:#c3ccdb;max-width:720px;margin:-16px 0 22px}.audit{background:rgba(9,13,24,.8);border:1px solid var(--line);border-radius:14px;overflow:hidden;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}
.audit .row{display:grid;grid-template-columns:240px 64px minmax(0,1fr);gap:14px;align-items:start;padding:12px 18px;border-top:1px solid var(--line)}.audit .row:first-child{border-top:0}.audit .h{color:#fff}.audit .v{color:var(--muted);overflow-wrap:anywhere}
.audit .on,.audit .off{display:inline-block;text-align:center;padding:1px 0;border-radius:6px;font-weight:600}.audit .on{background:rgba(74,222,128,.14);color:var(--ok)}.audit .off{background:rgba(239,68,68,.12);color:#f87171}.audit .note{padding:12px 18px;border-top:1px solid var(--line);color:var(--muted)}
@media(max-width:860px){.audit .row{grid-template-columns:minmax(0,1fr) 56px}.audit .v{grid-column:1/-1}}
.sub em{font-family:'Iowan Old Style',Georgia,serif;font-style:italic;color:#fff}
.creds{list-style:none;display:flex;flex-wrap:wrap;gap:8px 18px;margin:26px 0 0;padding:0;font-size:13px;color:var(--muted)}.creds li{display:flex;align-items:center;gap:8px}.creds li:before{content:'';width:14px;height:14px;border-radius:4px;background:linear-gradient(135deg,var(--a1),var(--a2));-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z'/%3E%3C/svg%3E") center/contain no-repeat}
.hdr{margin-left:10px;padding:3px 9px;border:1px solid var(--line);border-radius:7px;color:var(--muted);text-decoration:none;font-size:12px}.hdr b{color:var(--ok)}.hdr:hover{border-color:var(--ok)}
.bg{position:fixed;inset:0;z-index:-1;overflow:hidden;background:var(--bg)}.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(148,163,184,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.06) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse at 50% 30%,#000 30%,transparent 80%);-webkit-mask-image:radial-gradient(ellipse at 50% 30%,#000 30%,transparent 80%)}
.glow{position:absolute;width:520px;height:520px;border-radius:50%;filter:blur(110px);opacity:.35;animation:drift 22s ease-in-out infinite alternate}.g1{background:#1d4ed8;top:-120px;left:-120px}.g2{background:#059669;bottom:-200px;left:35%;animation-delay:-7s;opacity:.22}.g3{background:#7c3aed;top:30%;right:-180px;animation-delay:-13s;opacity:.28}
@keyframes drift{to{transform:translate(80px,60px) scale(1.15)}}
.nav{top:14px;left:50%;right:auto;transform:translateX(-50%);width:min(1140px,calc(100% - 24px));border:1px solid var(--line);border-radius:16px;background:rgba(12,18,32,.55);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);padding:10px 14px 10px 18px}
.scrolled .nav{background:rgba(12,18,32,.82);padding:10px 14px 10px 18px}.logo{display:flex;align-items:center;gap:8px;font:600 16px ui-monospace,SFMono-Regular,Menlo,monospace;color:#fff;background:none;-webkit-text-fill-color:currentColor}.logo span{color:var(--a1);margin-left:-8px}.logo i{width:8px;height:8px;border-radius:2px;background:var(--ok);box-shadow:0 0 10px var(--ok)}
.nav-r{display:flex;align-items:center;gap:10px}.kbtn{background:transparent;border:1px solid var(--line);border-radius:9px;color:var(--muted);padding:5px 8px;cursor:pointer}.kbtn:hover{color:#fff;border-color:var(--a1)}kbd{font:12px ui-monospace,Menlo,monospace}
.btn.small{padding:7px 14px;font-size:14px}
.hero{min-height:100vh;min-height:100svh;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:48px;align-items:center;text-align:left;padding-top:96px;overflow:visible}.hero:after{display:none}
.status{display:inline-flex;align-items:center;gap:10px;font:12px ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 18px}.status i{width:8px;height:8px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 rgba(74,222,128,.6);animation:pulse 2s infinite}@keyframes pulse{70%{box-shadow:0 0 0 8px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}
.h1{font-size:clamp(48px,7vw,96px);line-height:.98}.grad{background:linear-gradient(90deg,#38bdf8,#22c55e 55%,#818cf8);-webkit-background-clip:text;background-clip:text;color:transparent}
.mono{font:15px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--ok);margin:22px 0 0}.sub{margin:14px 0 0;max-width:520px;color:#c3ccdb;font-size:18px;letter-spacing:0}.hero .pills{margin-top:28px}.rise:nth-child(2){animation-delay:.08s}.rise:nth-child(3){animation-delay:.16s}.rise:nth-child(4){animation-delay:.24s}.rise:nth-child(5){animation-delay:.32s}.hero-r.rise{animation-delay:.35s}
.term{background:rgba(9,13,24,.85);border:1px solid var(--line);border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.45),0 0 0 1px rgba(56,189,248,.05);overflow:hidden}.tbar{display:flex;align-items:center;gap:7px;padding:11px 14px;border-bottom:1px solid var(--line)}.tbar i{width:11px;height:11px;border-radius:50%;background:#ef4444}.tbar i:nth-child(2){background:#f59e0b}.tbar i:nth-child(3){background:#22c55e}.tbar span{margin-left:10px;font:12px ui-monospace,Menlo,monospace;color:var(--muted)}
.hero-l,.hero-r{min-width:0}.term pre{margin:0;padding:20px 22px;min-height:300px;overflow-wrap:anywhere;font:14px/1.75 ui-monospace,SFMono-Regular,Menlo,monospace;color:#cbd5e1;white-space:pre-wrap}.term .pr{color:var(--ok)}.term .pa{color:var(--a1)}.term .out{color:#94a3b8}.term .cur{display:inline-block;width:8px;height:16px;background:var(--a1);vertical-align:-3px;animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}
.label{display:flex;align-items:center;gap:10px;font:12px ui-monospace,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin:0 0 10px}.label i{width:7px;height:7px;border-radius:50%;background:var(--ok)}.label b{color:var(--a1);font-weight:500;margin-right:2px}.label.center{justify-content:center}
.title{font-size:clamp(30px,4vw,48px);letter-spacing:-.025em;text-transform:none;color:#fff;font-weight:800;margin:0 0 40px}
.bento{margin-bottom:8px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.tile.lead{grid-column:1/-1}.tile{background:rgba(17,26,46,.72);border:1px solid var(--line);border-radius:18px;padding:22px;backdrop-filter:blur(6px)}.tile.lead{padding:28px}.tile.lead p{margin:0 0 14px;color:#c3ccdb;font-size:17px}.tile.stat b{display:block;font-size:40px;line-height:1.05;color:#fff;letter-spacing:-.02em}.tile.stat span{color:var(--muted);font-size:14px}
@media(min-width:861px){.bento{grid-template-columns:repeat(6,minmax(0,1fr));grid-auto-rows:minmax(150px,auto)}.tile.lead{grid-column:span 4;grid-row:span 2}.tile.stat{grid-column:span 1;display:flex;flex-direction:column;justify-content:flex-start}}
.palette{position:fixed;inset:0;z-index:50;background:rgba(5,8,15,.6);backdrop-filter:blur(4px);display:grid;place-items:start center;padding-top:14vh}.palette[hidden]{display:none}.pbox{width:min(560px,calc(100% - 32px));background:#0f1729;border:1px solid var(--line);border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.6);overflow:hidden}
#pq{width:100%;background:transparent;border:0;border-bottom:1px solid var(--line);padding:16px 18px;color:#fff;font-size:16px;outline:none}#plist{list-style:none;margin:0;padding:6px;max-height:320px;overflow:auto}#plist li{padding:10px 12px;border-radius:9px;cursor:pointer;display:flex;justify-content:space-between;color:#cbd5e1}#plist li span{color:var(--muted);font-size:13px}#plist li.sel{background:rgba(56,189,248,.12);color:#fff}.phint{margin:0;padding:10px 16px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}.phint kbd{border:1px solid var(--line);border-radius:5px;padding:1px 5px;margin:0 2px}
@media(max-width:860px){.hero{grid-template-columns:minmax(0,1fr);padding-top:110px;gap:28px;min-height:auto;padding-bottom:40px}.nav nav{display:none}.term pre{min-height:230px;font-size:13px}}
@media(prefers-reduced-motion:reduce){.glow{animation:none}}`;
  const js = `(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-d]').forEach((el) => el.style.setProperty('--d', el.dataset.d + 's'));
  document.querySelectorAll('.fig svg').forEach((svg) => svg.querySelectorAll('.n,.vpc,.pub,.prv,.step,.ar').forEach((el, k) => el.style.setProperty('--k', k)));
  document.querySelectorAll('.work, .skills, .timeline').forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty('--i', i % 3)));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
    e.target.querySelectorAll('[data-count]').forEach((el) => { if (reduce) return; const n = +el.dataset.count, suf = el.dataset.suffix, t0 = performance.now();
      const step = (t) => { const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }); }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  const bar = document.getElementById('progress'), tl = document.querySelector('.timeline'); let ticking = false;
  const onScroll = () => { ticking = false; const sh = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (sh > 0 ? scrollY / sh : 0) + ')'; document.body.classList.toggle('scrolled', scrollY > 30);
    if (tl) { const r = tl.getBoundingClientRect(), mid = innerHeight * .6; tl.style.setProperty('--p', reduce ? 1 : Math.min(Math.max((mid - r.top) / r.height, 0), 1)); tl.querySelectorAll('.job').forEach((j) => j.classList.toggle('lit', j.getBoundingClientRect().top + 10 < mid)); } };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
  const links = [...document.querySelectorAll('.nav nav a[href^="#"]')];
  const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => so.observe(s));
  // network background in the hero only; pauses off-screen or when the tab is hidden
  const c = document.getElementById('net'); if (reduce || !c.getContext) return; const x = c.getContext('2d'); let W, H, P, raf = 0, on = true, mx = -1e9, my = -1e9;
  const init = () => { const d = devicePixelRatio || 1, r = c.getBoundingClientRect(); W = c.width = r.width * d; H = c.height = r.height * d;
    P = Array.from({ length: Math.min(90, Math.floor(r.width / 15)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35 * d, vy: (Math.random() - .5) * .35 * d })); };
  c.parentElement.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(), d = devicePixelRatio || 1; mx = (e.clientX - r.left) * d; my = (e.clientY - r.top) * d; });
  const draw = () => { if (!on) return; const d = devicePixelRatio || 1, R = 140 * d; x.clearRect(0, 0, W, H);
    for (const p of P) { const dx = p.x - mx, dy = p.y - my, dm = Math.hypot(dx, dy); if (dm < 120 * d) { p.x += dx / dm * .8; p.y += dy / dm * .8; } p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) { const a = P[i], b = P[j], dd = Math.hypot(a.x - b.x, a.y - b.y); if (dd < R) { x.strokeStyle = 'rgba(56,189,248,' + (.18 * (1 - dd / R)) + ')'; x.lineWidth = d; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); } }
    x.fillStyle = 'rgba(129,140,248,.6)'; for (const p of P) { x.beginPath(); x.arc(p.x, p.y, 1.7 * d, 0, 7); x.fill(); } raf = requestAnimationFrame(draw); };
  addEventListener('resize', init); init(); draw();
  new IntersectionObserver(([e]) => { on = e.isIntersecting && !document.hidden; cancelAnimationFrame(raf); if (on) draw(); }).observe(c);
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); on = !document.hidden; if (on) draw(); });
})();`;
  const jsF = `
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // terminal: types real commands with true output, then idles with a cursor
  const out = document.getElementById('tout'); if (out) { const script = JSON.parse(out.dataset.script); const add = (cls, t) => { const sp = document.createElement('span'); sp.className = cls; sp.textContent = t; out.appendChild(sp); return sp; };
    const prompt = () => { add('pr', 'neel@secbox'); add('', ':'); add('pa', '~'); add('', '$ '); };
    if (reduce) { script.forEach(([c, o]) => { prompt(); add('', c + '\\n'); o.forEach((l) => add('out', l + '\\n')); }); prompt(); }
    else { let i = 0; const next = () => { if (i >= script.length) { prompt(); add('cur', ''); return; } const [c, o] = script[i++]; prompt(); const line = add('', ''); let k = 0;
      const type = () => { line.textContent = c.slice(0, ++k); if (k < c.length) return setTimeout(type, 45 + Math.random() * 40); add('', '\\n'); setTimeout(() => { o.forEach((l) => add('out', l + '\\n')); setTimeout(next, 650); }, 260); }; setTimeout(type, 350); };
      setTimeout(next, 900); } }
  // stagger skill chips
  document.querySelectorAll('.sk2').forEach((card) => card.querySelectorAll('.chip').forEach((ch, k) => ch.style.setProperty('--c', k)));
  // live background: packets travel along the 64px grid lines; a soft light follows the cursor
  const bg = document.querySelector('.bg'); addEventListener('pointermove', (e) => { bg.style.setProperty('--cx', e.clientX + 'px'); bg.style.setProperty('--cy', e.clientY + 'px'); }, { passive: true });
  const fx = document.getElementById('fx');
  if (fx && !reduce && fx.getContext) { const g = fx.getContext('2d'); const S = 64; let W, H, d, P = [], raf = 0;
    const COLORS = ['56,189,248', '74,222,128', '129,140,248'];
    const spawn = () => { const cols = Math.ceil(innerWidth / S), rows = Math.ceil(innerHeight / S); const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]; const [dx, dy] = dirs[Math.random() * 4 | 0];
      return { x: (Math.random() * cols | 0) * S, y: (Math.random() * rows | 0) * S, dx, dy, v: 0.9 + Math.random() * 1.1, trail: [], life: 400 + Math.random() * 500, c: COLORS[Math.random() * 3 | 0] }; };
    const init = () => { d = devicePixelRatio || 1; W = fx.width = innerWidth * d; H = fx.height = innerHeight * d; const n = Math.max(8, Math.min(22, Math.round(innerWidth * innerHeight / 70000))); P = Array.from({ length: n }, spawn); };
    const step = () => { g.clearRect(0, 0, W, H);
      for (let i = 0; i < P.length; i++) { const p = P[i]; p.x += p.dx * p.v; p.y += p.dy * p.v; p.life -= 1;
        if (Math.abs(p.x % S) < p.v && Math.abs(p.y % S) < p.v && Math.random() < 0.35) { p.x = Math.round(p.x / S) * S; p.y = Math.round(p.y / S) * S; const turn = Math.random() < 0.5 ? 1 : -1; [p.dx, p.dy] = p.dx ? [0, turn] : [turn, 0]; }
        p.trail.push([p.x, p.y]); if (p.trail.length > 46) p.trail.shift();
        if (p.life < 0 || p.x < -S || p.y < -S || p.x > innerWidth + S || p.y > innerHeight + S) { P[i] = spawn(); continue; }
        for (let k = 1; k < p.trail.length; k++) { const a = k / p.trail.length; g.strokeStyle = 'rgba(' + p.c + ',' + (a * 0.55) + ')'; g.lineWidth = 1.6 * d; g.beginPath(); g.moveTo(p.trail[k - 1][0] * d, p.trail[k - 1][1] * d); g.lineTo(p.trail[k][0] * d, p.trail[k][1] * d); g.stroke(); }
        g.fillStyle = 'rgba(' + p.c + ',.95)'; g.shadowColor = 'rgba(' + p.c + ',.9)'; g.shadowBlur = 10 * d; g.beginPath(); g.arc(p.x * d, p.y * d, 2 * d, 0, 7); g.fill(); g.shadowBlur = 0; }
      raf = requestAnimationFrame(step); };
    addEventListener('resize', init); init(); step();
    document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden) step(); }); }
  // self-audit: read this page's own response headers (needs connect-src 'self')
  const box = document.getElementById('audit');
  if (box) { const want = [['Content-Security-Policy', 'content-security-policy'], ['Strict-Transport-Security', 'strict-transport-security'], ['X-Content-Type-Options', 'x-content-type-options'], ['Referrer-Policy', 'referrer-policy'], ['Permissions-Policy', 'permissions-policy'], ['Cross-Origin-Opener-Policy', 'cross-origin-opener-policy'], ['X-Frame-Options', 'x-frame-options']];
    fetch(location.href, { method: 'HEAD', cache: 'no-store' }).then((r) => { let on = 0; const rows = want.map(([label, key]) => { const v = r.headers.get(key); if (v) on++; const row = document.createElement('div'); row.className = 'row';
        const h = document.createElement('span'); h.className = 'h'; h.textContent = label; const st = document.createElement('span'); st.className = v ? 'on' : 'off'; st.textContent = v ? 'ON' : 'OFF'; const val = document.createElement('span'); val.className = 'v'; val.textContent = v || 'not sent'; row.append(h, st, val); return row; });
      const note = document.createElement('p'); note.className = 'note'; note.textContent = on === want.length ? 'All ' + on + ' headers present. Read live at ' + new Date().toLocaleString() + '.' : (['localhost', '127.0.0.1'].includes(location.hostname) || /^(192[.]168|10)[.]/.test(location.hostname) || /^172[.](1[6-9]|2[0-9]|3[01])[.]/.test(location.hostname) ? 'You are viewing a local preview, which sends no security headers. The live site sends them from CloudFront.' : on + ' of ' + want.length + ' headers present. Read live at ' + new Date().toLocaleString() + '.');
      box.replaceChildren(...rows, note); }).catch(() => { box.replaceChildren(Object.assign(document.createElement('p'), { className: 'note', textContent: 'Could not read headers from this page.' })); }); }
  // command palette (Cmd/Ctrl+K)
  const pal = document.getElementById('palette'), q = document.getElementById('pq'), list = document.getElementById('plist'); if (!pal) return;
  const items = [['Work', '#work', 'section'], ['About', '#about', 'section'], ['Experience', '#experience', 'section'], ['Skills', '#skills', 'section'], ['Credentials', '#credentials', 'section'], ['Security self-audit', '#security', 'section'], ['Contact', '#contact', 'section'],
    ...[...document.querySelectorAll('.proj h3 a')].map((a) => [a.textContent, a.href, 'project']), ['Resume (PDF)', document.querySelector('.nav .btn').href, 'file'], ['LinkedIn', ${JSON.stringify(s.contact.linkedin)}, 'link'], ['GitHub', ${JSON.stringify(s.contact.github)}, 'link'], ['Email', 'mailto:${s.contact.email}', 'link']];
  let sel = 0, shown = items; const render = () => { list.replaceChildren(...shown.map(([t, h, k], i) => { const li = document.createElement('li'); li.textContent = t; const sp = document.createElement('span'); sp.textContent = k; li.appendChild(sp); if (i === sel) li.className = 'sel'; li.addEventListener('click', () => go(h)); return li; })); };
  const open = () => { pal.hidden = false; q.value = ''; shown = items; sel = 0; render(); q.focus(); }, close = () => { pal.hidden = true; };
  const go = (h) => { close(); if (h.startsWith('#')) document.querySelector(h)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); else window.open(h, h.startsWith('mailto:') ? '_self' : '_blank', 'noopener'); };
  document.getElementById('kopen').addEventListener('click', open);
  addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? open() : close(); } else if (!pal.hidden) { if (e.key === 'Escape') close(); if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); } if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); } if (e.key === 'Enter' && shown[sel]) go(shown[sel][1]); } });
  q.addEventListener('input', () => { const v = q.value.toLowerCase(); shown = items.filter(([t]) => t.toLowerCase().includes(v)); sel = 0; render(); });
  pal.addEventListener('click', (e) => { if (e.target === pal) close(); });
})();`;
  return { html, css: css + cssF, js: js.replace('const c = document.getElementById(\'net\'); if (reduce || !c.getContext) return;', 'const c = document.getElementById(\'net\'); if (!c || reduce || !c.getContext) return;') + jsF };
}
