/* ============================================================
   Motion layer — v2
   Counters, card tilt, headline reveal, scroll progress,
   cursor glow, sticky header state.
   Everything here is decorative and skipped under
   prefers-reduced-motion.
   ============================================================ */

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll progress bar ---- */
  (function () {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    let ticking = false;
    function update() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ---- Sticky header state ---- */
  (function () {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let ticking = false;
    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  if (reduced) return;

  /* ---- Cursor glow ---- */
  (function () {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('is-on');
    }, { passive: true });
    (function loop() {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(loop);
    })();
  })();

  /* ---- Headline: reveal word by word ---- */
  (function () {
    const h = document.querySelector('.hero h1');
    if (!h) return;

    function wrap(node) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((chunk) => {
        if (!chunk.trim()) { frag.appendChild(document.createTextNode(chunk)); return; }
        const s = document.createElement('span');
        s.className = 'word';
        s.textContent = chunk;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    }

    Array.from(h.childNodes).forEach((n) => {
      if (n.nodeType === 3) wrap(n);
      else if (n.nodeType === 1) Array.from(n.childNodes).forEach((c) => {
        if (c.nodeType === 3) wrap(c);
      });
    });

    h.querySelectorAll('.word').forEach((w, i) => {
      w.style.animationDelay = (0.35 + i * 0.065) + 's';
    });
  })();

  /* ---- Counters ---- */
  (function () {
    const nums = document.querySelectorAll('.facts__n');
    if (!nums.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target;
        const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
        if (!target) return;
        const dur = 1500, start = performance.now();
        (function tick(now) {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  })();

  /* ---- Card tilt ---- */
  (function () {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.querySelectorAll('.zone-card, .service').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width - 0.5;
        const cy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${-cy * 7}deg) rotateY(${cx * 9}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  })();

  /* ---- Staggered reveal for grids ---- */
  (function () {
    document.querySelectorAll('.zone-grid, .services, .bearers, .facts__grid')
      .forEach((el) => el.classList.add('reveal-stagger'));

    const items = document.querySelectorAll('.reveal-stagger');
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px' });
    items.forEach((el) => io.observe(el));
  })();

  /* ---- Section headings get the animated rule ---- */
  (function () {
    const heads = document.querySelectorAll('.head');
    if (!heads.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    heads.forEach((el) => io.observe(el));
  })();
})();
