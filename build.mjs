// Builds the portfolio into site/, the folder that gets deployed.
//   node build.mjs
// Sources: content.mjs (all site text), page.mjs (layout, styles, script),
// diagrams.mjs (project diagrams and About stats). The page has no inline script or style,
// so it runs under a strict Content Security Policy (needs font-src 'self' and connect-src 'self').
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { site as s } from './content.mjs';
import { F } from './page.mjs';

const OUT = 'site';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
const { html, css, js } = F(s);
// Version stamps make browsers fetch new CSS and JS after each deploy (they cache them for a day).
const v = (t) => crypto.createHash('sha256').update(t).digest('hex').slice(0, 10);
const page = html.replace('href="style.css"', `href="style.css?v=${v(css)}"`).replace('src="main.js"', `src="main.js?v=${v(js)}"`);
fs.writeFileSync(path.join(OUT, 'index.html'), page);
fs.writeFileSync(path.join(OUT, 'style.css'), css);
fs.writeFileSync(path.join(OUT, 'main.js'), js);
for (const f of ['favicon.svg', s.contact.resume]) if (fs.existsSync(f)) fs.copyFileSync(f, path.join(OUT, f)); else console.warn('skipped missing ' + f);
fs.cpSync('assets', path.join(OUT, 'assets'), { recursive: true });
// /newyear greeting page (static files in newyear/), with the same version stamps.
fs.mkdirSync(path.join(OUT, 'newyear'), { recursive: true });
const nyCss = fs.readFileSync('newyear/ny.css', 'utf8'), nyJs = fs.readFileSync('newyear/ny.js', 'utf8');
fs.writeFileSync(path.join(OUT, 'newyear', 'ny.css'), nyCss);
fs.writeFileSync(path.join(OUT, 'newyear', 'ny.js'), nyJs);
fs.writeFileSync(path.join(OUT, 'newyear', 'index.html'), fs.readFileSync('newyear/index.html', 'utf8')
  .replace('href="/newyear/ny.css"', `href="/newyear/ny.css?v=${v(nyCss)}"`).replace('src="/newyear/ny.js"', `src="/newyear/ny.js?v=${v(nyJs)}"`));
// Search engines: robots.txt and sitemap.xml. Link previews: og.png (1200x630, made from og.html with a browser screenshot).
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://neelmoradiya.com/sitemap.xml\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>https://neelmoradiya.com/</loc><lastmod>${today}</lastmod></url>\n<url><loc>https://neelmoradiya.com/newyear/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`);
if (fs.existsSync('og.png')) fs.copyFileSync('og.png', path.join(OUT, 'og.png'));
console.log('built site/ (index.html, style.css, main.js, favicon, resume, assets)');
