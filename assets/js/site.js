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
  return SCHOOLS.filter((s) => s.zone === id).length;
}

/* ---- Render zone cards ---- */
(function () {
  const host = document.getElementById('zone-grid');
  if (!host || typeof ZONES === 'undefined') return;

  host.innerHTML = ZONES.map((z) => {
    const n = countByZone(z.id);
    const label = n ? `${n} member ${n === 1 ? 'school' : 'schools'} listed`
                    : 'List being compiled';
    return `<a class="zone-card" href="schools.html?zone=${z.id}" ${z.pending ? 'data-pending="true"' : ''}>
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
    const action = has ? 'Download PDF' : 'Copy on request';
    return `<${tag} class="doc"${href}>
      <span class="doc__ref">${d.ref}${d.year ? '<br>' + d.year : ''}</span>
      <span>
        <span class="doc__title">${d.title}</span>
        <span class="doc__meta">${d.note}</span>
      </span>
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
  let zone = params.get('zone') || 'all';
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
      ? `Showing ${list.length} of ${SCHOOLS.length} schools`
      : '';

    body.innerHTML = list.length
      ? list.map((s) => `<tr>
          <td>${s.name}</td>
          <td data-l="Zone">${zoneName(s.zone)}</td>
          <td data-l="District">${s.district || '—'}</td>
        </tr>`).join('')
      : `<tr><td colspan="3" class="empty">No school matches that search. Try a zone name, a district, or part of the school name.</td></tr>`;

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
