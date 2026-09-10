/* ============================================================
   Shared site behaviour
   ============================================================ */

/* ---- Mobile navigation ---- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.dataset.open === 'true';
    nav.dataset.open = String(!open);
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.textContent = open ? 'Menu' : 'Close';
  });

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth <= 940) {
      nav.dataset.open = 'false';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    }
  });
})();

/* ---- Mark the current page in the nav ---- */
(function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#primary-nav a').forEach((a) => {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });
})();

/* ---- Gentle reveal on scroll ---- */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  items.forEach((el) => io.observe(el));
})();

/* ---- Zone counts, used on several pages ---- */
function countByZone(id) {
  if (typeof SCHOOLS === 'undefined') return 0;
  const targetId = id === 'cuttack' ? 'central' : id === 'berhampur' ? 'ganjam' : id;
  return SCHOOLS.filter((s) => s.zone === targetId).length;
}

/* ---- Render zone cards ---- */
(function () {
  const host = document.getElementById('zone-grid');
  if (!host || typeof ZONES === 'undefined') return;

  host.innerHTML = ZONES.map((z) => {
    const n = countByZone(z.id);
    const label = `${n} verified ${n === 1 ? 'school' : 'schools'} listed`;
    return `<a class="zone-card" href="schools.html?zone=${z.id}">
      <h3>${z.name}</h3>
      <p class="zone-card__dist">${z.districts}</p>
      <span class="zone-card__n">${label}</span>
    </a>`;
  }).join('');
})();

/* ---- Render the document archive ---- */
(function () {
  const host = document.getElementById('doc-list');
  if (!host || typeof DOCUMENTS === 'undefined') return;

  const limit = parseInt(host.dataset.limit || '0', 10);
  const rows = limit ? DOCUMENTS.slice(0, limit) : DOCUMENTS;

  host.innerHTML = rows.map((d) => {
    const has = Boolean(d.file);
    const tag = has ? 'a' : 'div';
    const href = has ? ` href="assets/docs/${d.file}" download` : '';
    const action = has ? 'Download Verified PDF' : 'Copy on request';
    return `<${tag} class="doc"${href}>
      <span class="doc__ref">${d.ref}${d.year ? '<br>' + d.year : ''}</span>
      <span style="flex:1">
        <span class="doc__title">
          ${d.badge ? `<span class="doc__badge doc__badge--court">${d.badge}</span> ` : ''}
          ${d.title}
        </span>
        <span class="doc__meta">${d.note}</span>
        ${d.image ? `<span style="display:inline-flex;align-items:center;gap:0.35rem;margin-top:0.35rem;font-size:0.75rem;color:#B45309;font-weight:600">📜 Official Scanned Front Page Available</span>` : ''}
      </span>
      ${d.image ? `<div style="width:42px;height:56px;position:relative;border:1px solid #CBD5E1;border-radius:3px;overflow:hidden;flex-shrink:0;margin-right:0.65rem;box-shadow:0 2px 5px rgba(0,0,0,0.12)"><img src="${d.image}" alt="Scan preview" style="width:100%;height:100%;object-fit:cover"></div>` : ''}
      <span class="doc__get">${action}</span>
    </${tag}>`;
  }).join('');
})();

/* ---- Schools directory: search + zone filter ---- */
(function () {
  const body = document.getElementById('school-rows');
  if (!body || typeof SCHOOLS === 'undefined') return;

  const search = document.getElementById('school-search');
  const chips = Array.from(document.querySelectorAll('[data-filter]'));
  const counter = document.getElementById('school-count');

  const params = new URLSearchParams(location.search);
  let rawZone = params.get('zone') || 'all';
  let zone = rawZone === 'cuttack' ? 'central' : rawZone === 'berhampur' ? 'ganjam' : rawZone;
  let query = '';

  const zoneName = (id) => (ZONES.find((z) => z.id === id) || {}).name || id;

  function paint() {
    const q = query.trim().toLowerCase();
    const list = SCHOOLS.filter((s) => {
      const zoneOk = zone === 'all' || s.zone === zone;
      const textOk = !q ||
        s.name.toLowerCase().includes(q) ||
        (s.district || '').toLowerCase().includes(q) ||
        zoneName(s.zone).toLowerCase().includes(q);
      return zoneOk && textOk;
    });

    counter.textContent = list.length
      ? `Showing ${list.length} of ${SCHOOLS.length} verified member schools`
      : '';

    body.innerHTML = list.length
      ? list.map((s, idx) => `<tr>
          <td data-l="School" style="color: #0F172A !important; font-weight: 600; font-family: var(--display); font-size: 1.05rem;">${s.name}</td>
          <td data-l="Zone" style="color: #FBBF24 !important; font-weight: 600;">${zoneName(s.zone)}</td>
          <td data-l="District" style="color: #E2E8F0 !important;">${s.district || 'Odisha'}</td>
        </tr>`).join('')
      : `<tr><td colspan="3" class="empty" style="color: #CBD5E1 !important;">No schools match &ldquo;${query}&rdquo; in this zone. Select &ldquo;All&rdquo; or check spelling.</td></tr>`;

    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === zone)));
  }

  chips.forEach((c) => c.addEventListener('click', () => {
    zone = c.dataset.filter;
    const url = new URL(location.href);
    if (zone === 'all') url.searchParams.delete('zone');
    else url.searchParams.set('zone', zone);
    history.replaceState({}, '', url);
    paint();
  }));

  if (search) search.addEventListener('input', (e) => { query = e.target.value; paint(); });

  paint();
})();

/* ---- Live stat: member school count ---- */
(function () {
  const el = document.getElementById('stat-schools');
  if (el && typeof SCHOOLS !== 'undefined') el.textContent = SCHOOLS.length;
})();
