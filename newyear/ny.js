// New Year greeting page: canvas fireworks, a "2083" written in sparks, a typed terminal, and rotating quotes.
// No inline script or style, so it runs under the site's strict Content Security Policy.
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const cv = document.getElementById('fx');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1;

  function size() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  size();
  window.addEventListener('resize', size);

  const small = () => W < 700;
  const MAX = () => (small() ? 1500 : 2800);
  const PALETTE = [
    [255, 153, 51], [255, 209, 102], [255, 79, 139], [34, 228, 255],
    [139, 92, 246], [74, 222, 128], [255, 255, 255], [255, 120, 60],
  ];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const G = 0.045;

  const rockets = [];
  const parts = [];

  function spark(x, y, vx, vy, col, o = {}) {
    if (parts.length >= MAX()) return null;
    const p = {
      x, y, vx, vy, col,
      life: 1, decay: o.decay ?? rnd(0.011, 0.02), drag: o.drag ?? 0.985, grav: o.grav ?? 1,
      size: o.size ?? rnd(1.4, 2.4), flicker: o.flicker ?? false, crackle: o.crackle ?? false,
      tx: o.tx, ty: o.ty, hold: o.hold ?? 0, seek: o.tx !== undefined,
    };
    parts.push(p);
    return p;
  }

  // ---------- Rockets ----------
  function launch(x, ty, opts = {}) {
    x = x ?? rnd(W * 0.12, W * 0.88);
    ty = ty ?? rnd(H * 0.1, H * 0.42);
    const sx = x + rnd(-W * 0.06, W * 0.06);
    const dist = Math.max(80, H - ty);
    const vy = -Math.sqrt(2 * G * 1.15 * dist);
    rockets.push({ x: sx, y: H + 10, vx: (x - sx) / (dist / -vy * 1.6), vy, ty, col: opts.col || pick(PALETTE), type: opts.type });
  }

  const TYPES = ['peony', 'peony', 'ring', 'willow', 'crackle', 'double', 'palm', 'heart', 'glitter'];

  function burst(x, y, col, type) {
    type = type || pick(TYPES);
    const scale = small() ? 0.8 : 1;
    if (type === 'ring') {
      const n = 64, s = rnd(3.2, 4.2) * scale, tilt = rnd(0.35, 1);
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; spark(x, y, Math.cos(a) * s, Math.sin(a) * s * tilt, col, { decay: 0.014 }); }
    } else if (type === 'willow') {
      const n = 110, gold = [255, 200, 90];
      for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), s = rnd(0.6, 3.6) * scale; spark(x, y, Math.cos(a) * s, Math.sin(a) * s, gold, { decay: rnd(0.006, 0.009), drag: 0.975, grav: 1.4, flicker: true, size: 1.6 }); }
    } else if (type === 'palm') {
      const arms = 8;
      for (let k = 0; k < arms; k++) {
        const a = (k / arms) * Math.PI * 2 + rnd(-0.1, 0.1);
        for (let j = 0; j < 14; j++) { const s = (1.4 + j * 0.26) * scale; spark(x, y, Math.cos(a) * s, Math.sin(a) * s - 0.6, col, { decay: rnd(0.009, 0.013), grav: 1.2 }); }
      }
    } else if (type === 'heart') {
      const n = 90, s = 0.23 * scale;
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        spark(x, y, hx * s, hy * s, [255, 79, 139], { decay: 0.013, grav: 0.5 });
      }
    } else if (type === 'double') {
      const c2 = pick(PALETTE);
      for (let i = 0; i < 70; i++) { const a = rnd(0, Math.PI * 2), s = rnd(2.6, 4.4) * scale; spark(x, y, Math.cos(a) * s, Math.sin(a) * s, col); }
      for (let i = 0; i < 50; i++) { const a = rnd(0, Math.PI * 2), s = rnd(0.8, 2) * scale; spark(x, y, Math.cos(a) * s, Math.sin(a) * s, c2, { decay: 0.016 }); }
    } else if (type === 'glitter') {
      for (let i = 0; i < 120; i++) { const a = rnd(0, Math.PI * 2), s = rnd(0.5, 3.8) * scale; spark(x, y, Math.cos(a) * s, Math.sin(a) * s, [255, 240, 200], { decay: rnd(0.008, 0.014), flicker: true, size: 1.4 }); }
    } else {
      // peony and crackle
      const n = (small() ? 90 : 130);
      for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), s = Math.cbrt(Math.random()) * 4.6 * scale; spark(x, y, Math.cos(a) * s, Math.sin(a) * s, col, { crackle: type === 'crackle' }); }
    }
    flash(x, y, col);
  }

  // Brief light bloom where a shell bursts.
  const flashes = [];
  function flash(x, y, col) { flashes.push({ x, y, col, a: 0.55 }); }

  // ---------- Fireworks that write text ----------
  function textShow(str, cy) {
    const off = document.createElement('canvas');
    const fs = Math.min((W * 0.9) / (str.length * 0.62), W * 0.27, 260);
    off.width = Math.ceil(W); off.height = Math.ceil(fs * 1.4);
    const o = off.getContext('2d');
    o.fillStyle = '#fff';
    o.font = `700 ${fs}px 'Space Grotesk', system-ui, sans-serif`;
    o.textAlign = 'center'; o.textBaseline = 'middle';
    o.fillText(str, off.width / 2, off.height / 2);
    const img = o.getImageData(0, 0, off.width, off.height).data;
    const step = Math.max(4, Math.round(fs / (small() ? 15 : 22)));
    const pts = [];
    for (let y = 0; y < off.height; y += step) for (let x = 0; x < off.width; x += step) if (img[(y * off.width + x) * 4 + 3] > 128) pts.push([x, y]);
    const top = cy - off.height / 2;
    const ox = W / 2, oy = cy;
    flash(ox, oy, [255, 209, 102]);
    const cols = [[255, 209, 102], [255, 153, 51], [255, 79, 139], [34, 228, 255]];
    pts.forEach(([x, y], i) => {
      const a = rnd(0, Math.PI * 2), s = rnd(1, 6);
      const col = cols[Math.floor((x / off.width) * cols.length) % cols.length];
      spark(ox, oy, Math.cos(a) * s, Math.sin(a) * s, col, { tx: x, ty: top + y, hold: 110 + (i % 30), decay: 0.012, size: 2.1, flicker: true });
    });
  }

  // ---------- Animation loop ----------
  let last = performance.now();
  let running = true;
  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;

    // Fade the previous frame toward transparent, leaving soft trails.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0,0,0,${reduce ? 0.35 : 0.2})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i];
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 140);
      g.addColorStop(0, `rgba(${f.col[0]},${f.col[1]},${f.col[2]},${f.a * 0.5})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(f.x - 140, f.y - 140, 280, 280);
      f.a -= 0.05 * dt;
      if (f.a <= 0) flashes.splice(i, 1);
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.x += r.vx * dt; r.y += r.vy * dt; r.vy += G * dt;
      spark(r.x, r.y, rnd(-0.3, 0.3), rnd(0.5, 1.4), [255, 200, 140], { decay: 0.05, size: 1.3, grav: 0.4 });
      ctx.fillStyle = 'rgba(255,240,220,1)';
      ctx.fillRect(r.x - 1.5, r.y - 1.5, 3, 3);
      if (r.vy >= -0.4 || r.y <= r.ty) { burst(r.x, r.y, r.col, r.type); rockets.splice(i, 1); }
    }

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (p.seek) {
        p.x += (p.tx - p.x) * 0.075 * dt + rnd(-0.3, 0.3);
        p.y += (p.ty - p.y) * 0.075 * dt + rnd(-0.3, 0.3);
        p.hold -= dt;
        if (p.hold <= 0) { p.seek = false; p.vx = rnd(-0.5, 0.5); p.vy = rnd(-0.4, 0.6); }
      } else {
        p.vx *= Math.pow(p.drag, dt); p.vy *= Math.pow(p.drag, dt);
        p.vy += G * p.grav * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.life -= p.decay * dt;
      }
      if (p.life <= 0 || p.y > H + 20) {
        if (p.crackle && Math.random() < 0.35) for (let k = 0; k < 3; k++) spark(p.x, p.y, rnd(-1.4, 1.4), rnd(-1.4, 1.4), [255, 245, 220], { decay: 0.06, size: 1 });
        parts.splice(i, 1); continue;
      }
      let a = p.seek ? 1 : p.life;
      if (p.flicker && Math.random() < 0.3) a *= 0.25;
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${a})`;
      const s = p.size;
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; }
    else if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  });

  // ---------- Auto show ----------
  let autoTimer = 0;
  function auto() {
    if (!document.hidden) {
      launch();
      if (!reduce && Math.random() < 0.35) setTimeout(() => launch(), rnd(120, 380));
    }
    autoTimer = setTimeout(auto, reduce ? rnd(2200, 3600) : rnd(650, 1500));
  }

  function salvo(n, spread) {
    for (let i = 0; i < n; i++) setTimeout(() => launch(rnd(W * 0.08, W * 0.92), rnd(H * 0.08, H * 0.4)), i * spread + rnd(0, spread));
  }

  // ---------- Intro ----------
  let introDone = false;
  function endIntro() {
    if (introDone) return;
    introDone = true;
    body.classList.remove('intro');
    body.classList.add('ready');
    startTerminal();
    startQuotes();
    clearTimeout(autoTimer);
    auto();
  }
  document.getElementById('skip').addEventListener('click', (e) => { e.stopPropagation(); endIntro(); });

  if (reduce) {
    salvo(3, 300);
    setTimeout(endIntro, 400);
  } else {
    salvo(small() ? 5 : 8, 140);
    setTimeout(() => textShow('2083', H * 0.4), 1300);
    setTimeout(() => salvo(small() ? 4 : 7, 120), 3600);
    setTimeout(endIntro, 4300);
  }

  // Tap or click the sky to launch a firework toward that spot.
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a,button,.term,.quote')) return;
    if (!introDone) { endIntro(); return; }
    launch(e.clientX, Math.min(e.clientY, H * 0.85), { type: pick(TYPES) });
  });

  // ---------- Buttons ----------
  const toast = document.getElementById('toast');
  function say(msg) { toast.textContent = msg; toast.classList.add('on'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('on'), 2200); }

  // Finale: fade the page content so the whole sky is visible, burst instantly, then rockets and text.
  let finaleBusy = false;
  document.getElementById('finale').addEventListener('click', () => {
    if (finaleBusy) return;
    finaleBusy = true;
    body.classList.add('finale');
    // A different show from the intro: rainbow sweep, golden waterfall, hearts, then the name card.
    const RAINBOW = [[255, 64, 64], [255, 153, 51], [255, 209, 102], [74, 222, 128], [34, 228, 255], [96, 165, 250], [139, 92, 246], [255, 79, 139]];
    const n = small() ? 7 : 11;
    // 1. Rainbow sweep: instant rings bursting left to right across the sky.
    for (let i = 0; i < n; i++) setTimeout(() => burst(W * (0.08 + 0.84 * i / (n - 1)), H * (0.28 + 0.06 * Math.sin(i)), RAINBOW[i % RAINBOW.length], 'ring'), i * 110);
    // 2. Golden waterfall: a curtain of willows along the top, falling slowly.
    setTimeout(() => { for (let i = 0; i < n; i++) setTimeout(() => burst(W * (0.06 + 0.88 * i / (n - 1)), H * 0.14, [255, 200, 90], 'willow'), i * 60); }, 1500);
    // 3. Hearts in the middle.
    setTimeout(() => { burst(W * 0.5, H * 0.4, [255, 79, 139], 'heart'); setTimeout(() => { burst(W * 0.24, H * 0.5, [255, 79, 139], 'heart'); burst(W * 0.76, H * 0.5, [255, 79, 139], 'heart'); }, 350); }, 3000);
    // Crackle and glitter fill under the hearts.
    setTimeout(() => { for (let i = 0; i < 5; i++) setTimeout(() => burst(rnd(W * 0.1, W * 0.9), rnd(H * 0.55, H * 0.75), pick(RAINBOW), pick(['crackle', 'glitter'])), i * 160); }, 3600);
    setTimeout(() => { body.classList.add('fsign'); salvo(small() ? 6 : 10, 160); }, 4600);
    setTimeout(() => { body.classList.remove('fsign'); }, 9600);
    setTimeout(() => { body.classList.remove('finale'); }, 10200);
    setTimeout(() => { finaleBusy = false; }, 10600);
  });

  // Share: native share sheet when available (link is inside the text too, since some apps drop the url field);
  // otherwise a panel with the link, a copy button, and WhatsApp, X, and email.
  const LINK = 'https://neelmoradiya.com/newyear';
  const MSG = 'Happy New Year! Saal Mubarak from Neel Moradiya. Tap to light the sky: ' + LINK;
  const box = document.getElementById('sharebox');
  document.getElementById('shWa').href = 'https://wa.me/?text=' + encodeURIComponent(MSG);
  document.getElementById('shX').href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(MSG);
  document.getElementById('shMail').href = 'mailto:?subject=' + encodeURIComponent('Happy New Year from Neel') + '&body=' + encodeURIComponent(MSG);
  const openBox = () => { box.hidden = false; document.getElementById('copyLink').focus(); };
  const closeBox = () => { box.hidden = true; };
  document.getElementById('shareClose').addEventListener('click', closeBox);
  box.addEventListener('click', (e) => { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !box.hidden) closeBox(); });
  async function copy() {
    try { await navigator.clipboard.writeText(LINK); say('Link copied. Share the light!'); return; } catch (_) {}
    const inp = document.getElementById('shareUrl'); inp.focus(); inp.select();
    try { document.execCommand('copy'); say('Link copied. Share the light!'); } catch (_) { say('Select the link and copy it'); }
  }
  document.getElementById('copyLink').addEventListener('click', copy);
  document.getElementById('share').addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Happy New Year from Neel', text: MSG, url: LINK }); return; }
      catch (err) { if (err && err.name === 'AbortError') return; }
    }
    openBox();
  });

  // ---------- Terminal ----------
  function startTerminal() {
    const tty = document.getElementById('tty');
    const d = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const lines = [
      [['p', 'neel@secbox:~$ '], ['', 'date']],
      [['c', d]],
      [['p', 'neel@secbox:~$ '], ['', 'sudo ./new-year --samvat 2083']],
      [['ok', '[  ok  ] '], ['', 'Lighting diyas in every region']],
      [['ok', '[  ok  ] '], ['', 'Rotating keys: '], ['hl', '2082 → 2083']],
      [['ok', '[  ok  ] '], ['', 'Scanning last year for regrets: '], ['hl', '0 critical']],
      [['ok', '[  ok  ] '], ['', 'Deploying fireworks to every edge location']],
      [['ok', '[  ok  ] '], ['', 'MFA enabled: '], ['m', 'Mithai, Family, Aanand']],
      [['hl', '>> Saal Mubarak! May your year be bright and secure.']],
    ];
    if (reduce) {
      tty.innerHTML = '';
      lines.forEach((ln) => { ln.forEach(([cls, t]) => tty.appendChild(span(cls, t))); tty.appendChild(document.createTextNode('\n')); });
      return;
    }
    let li = 0, si = 0, ci = 0;
    const cur = span('cur', '');
    tty.textContent = '';
    tty.appendChild(cur);
    let node = null;
    function tick() {
      if (li >= lines.length) return;
      const seg = lines[li][si];
      if (!node) { node = span(seg[0], ''); tty.insertBefore(node, cur); }
      const isCmd = li % 2 === 0 && li < 3 && si === 1;
      const chunk = isCmd ? 1 : 3;
      node.textContent += seg[1].slice(ci, ci + chunk);
      ci += chunk;
      if (ci >= seg[1].length) {
        node = null; ci = 0; si++;
        if (si >= lines[li].length) { tty.insertBefore(document.createTextNode('\n'), cur); si = 0; li++; return setTimeout(tick, li < 3 ? 260 : 180); }
      }
      setTimeout(tick, isCmd ? rnd(45, 95) : 14);
    }
    setTimeout(tick, 500);
  }
  function span(cls, text) { const s = document.createElement('span'); if (cls) s.className = cls; s.textContent = text; return s; }

  // ---------- Quotes (decode effect) ----------
  const QUOTES = [
    ['Asato mā sad gamaya, tamaso mā jyotir gamaya. Lead me from untruth to truth, from darkness to light.', 'Brihadaranyaka Upanishad'],
    ['Arise, awake, and stop not till the goal is reached.', 'Swami Vivekananda'],
    ['Faith is the bird that feels the light and sings when the dawn is still dark.', 'Rabindranath Tagore'],
    ['Dream is not that which you see while sleeping, it is something that does not let you sleep.', 'A. P. J. Abdul Kalam'],
    ['The best way to predict the future is to invent it.', 'Alan Kay'],
    ['Security is a process, not a product.', 'Bruce Schneier'],
  ];
  const GLYPHS = '01<>/#$%&*+=?ABCDEF';
  function decode(el, text, ms = 900) {
    if (reduce) { el.textContent = text; return; }
    const start = performance.now();
    function step(now) {
      const k = Math.min((now - start) / ms, 1);
      const n = Math.floor(text.length * k);
      let out = text.slice(0, n);
      for (let i = n; i < text.length; i++) out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.textContent = out;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function startQuotes() {
    const q = document.getElementById('q'), qa = document.getElementById('qa'), bar = document.getElementById('qprog');
    let i = 0;
    function show() {
      const [t, a] = QUOTES[i % QUOTES.length];
      decode(q, t, 1100); decode(qa, a, 700);
      bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run');
      i++;
    }
    show();
    setInterval(show, 8000);
  }
})();
