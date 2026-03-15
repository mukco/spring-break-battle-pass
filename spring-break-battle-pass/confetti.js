(() => {
  'use strict';

  const prefersReduce = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeCanvas() {
    const c = document.createElement('canvas');
    c.id = 'sbConfetti';
    Object.assign(c.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '9999'
    });
    document.body.appendChild(c);
    return c;
  }

  const colors = ['#ff6a00', '#ffb000', '#00a3ff', '#2fe7b5', '#ffffff'];

  let canvas;
  let ctx;
  let particles = [];
  let raf = 0;
  let lastT = 0;

  function resize() {
    if (!canvas) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas._dpr = dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addBurst(x = 0.5, y = 0.25) {
    if (prefersReduce()) return;
    if (!canvas) {
      canvas = makeCanvas();
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
    }

    const count = 80;
    const startX = x * window.innerWidth;
    const startY = y * window.innerHeight;

    for (let i = 0; i < count; i += 1) {
      const speed = rand(260, 760);
      const angle = rand(-Math.PI * 0.9, -Math.PI * 0.1);
      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed + rand(-120, 120),
        vy: Math.sin(angle) * speed,
        g: rand(1100, 1600),
        r: rand(2.5, 6.5),
        rot: rand(0, Math.PI),
        vr: rand(-10, 10),
        color: colors[(Math.random() * colors.length) | 0],
        life: rand(0.9, 1.4),
        t: 0,
        shape: Math.random() < 0.2 ? 'star' : 'rect'
      });
    }

    if (!raf) {
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }

  function drawStar(x, y, r, rot) {
    const spikes = 5;
    const step = Math.PI / spikes;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i += 1) {
      const rr = i % 2 === 0 ? r : r * 0.45;
      const a = rot + i * step;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }

  function tick(now) {
    const dt = Math.min(0.033, (now - lastT) / 1000);
    lastT = now;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const next = [];
    for (const p of particles) {
      p.t += dt;
      const k = p.t / p.life;
      if (k >= 1) continue;

      p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;

      const alpha = Math.max(0, 1 - k);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.shape === 'star') {
        drawStar(p.x, p.y, p.r * 1.6, p.rot);
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.4);
        ctx.restore();
      }

      next.push(p);
    }

    ctx.globalAlpha = 1;
    particles = next;
    if (particles.length) {
      raf = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvas = null;
      ctx = null;
    }
  }

  window.addEventListener('sb:confetti', (ev) => {
    const d = ev.detail || {};
    addBurst(typeof d.x === 'number' ? d.x : 0.5, typeof d.y === 'number' ? d.y : 0.25);
  });
})();
