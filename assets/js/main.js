/* ============================================================
   main.js — idioma, render, filtro, paleta de comandos.
   Sem dependências.
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } }
  };

  // PT é o idioma principal da página; EN só entra se o visitante escolher
  // ou se o navegador estiver claramente em inglês e não houver escolha salva.
  const saved = store.get('lang', null);
  let lang = saved || ((navigator.language || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt');
  if (lang !== 'pt' && lang !== 'en') lang = 'pt';

  let filter = null;
  const openCards = new Set(['aiden']);

  const t  = (k) => (I18N[lang] && I18N[lang][k]) || (I18N.pt[k] || k);
  const tx = (v) => (v && typeof v === 'object' && !Array.isArray(v)) ? (v[lang] ?? v.pt) : v;
  // a chave interna da tecnologia é sempre a mesma; só o rótulo visível muda de idioma
  const techLabel = (k) => (typeof TAG_LABELS !== 'undefined' && TAG_LABELS[k]) ? tx(TAG_LABELS[k]) : k;

  /* ---------------- idioma ---------------- */
  function applyLang() {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.documentElement.dataset.lang = lang;
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-lang-opt]').forEach(el => el.classList.toggle('is-on', el.dataset.langOpt === lang));
    $('#paletteInput').placeholder = lang === 'pt' ? 'Ir para, abrir, copiar…' : 'Go to, open, copy…';
    renderStack(); renderProjects(); renderTimeline(); renderContact();
    startTyping(); runTerminal();
    store.set('lang', lang);
  }

  /* ---------------- stack ---------------- */
  function renderStack() {
    $('#stackGrid').innerHTML = STACK.map(g => `
      <div class="stack__group reveal">
        <h3 class="stack__title">${tx(g.group)}</h3>
        <div class="stack__items">
          ${g.items.map(i => `
            <button class="chip${filter === i.n ? ' chip--on' : ''}${i.soon ? ' chip--soon' : ''}" data-tech="${esc(i.n)}">
              ${esc(techLabel(i.n))}<span class="chip__where">${esc(tx(i.w))}</span>
            </button>`).join('')}
        </div>
      </div>`).join('');
    observeReveals();
  }

  /* ---------------- projetos ---------------- */
  function renderProjects() {
    const list = filter ? PROJECTS.filter(p => p.tags.includes(filter)) : PROJECTS;

    $('#filterBar').hidden = !filter;
    $('#filterChip').textContent = filter ? techLabel(filter) : '';
    $('#projectsEmpty').hidden = list.length > 0;

    $('#projectsGrid').innerHTML = list.map(p => {
      const open = openCards.has(p.id);
      return `
      <article class="card reveal${p.featured && !filter ? ' card--featured' : ''}${open ? ' is-open' : ''}" data-id="${p.id}">
        <div class="card__top">
          <span class="card__year mono">${esc(p.year)}</span>
          <span class="badge badge--${p.status.key}">${esc(tx(p.status))}</span>
          ${p.status2 ? `<span class="badge badge--${p.status2.key}">${esc(tx(p.status2))}</span>` : ''}
        </div>
        <h3 class="card__name">${esc(tx(p.name))}</h3>
        <p class="card__tagline">${esc(tx(p.tagline))}</p>
        ${p.stats.length ? `<div class="card__stats">${p.stats.map(s => `
          <div class="stat"><b>${esc(tx(s.v))}</b><span>${esc(tx(s.l))}</span></div>`).join('')}</div>` : ''}
        <div class="card__tags">
          ${p.tags.map(tg => `<button class="tag${filter === tg ? ' is-match' : ''}" data-tech="${esc(tg)}">${esc(techLabel(tg))}</button>`).join('')}
        </div>
        <div class="detail">
          <div class="detail__block"><span class="detail__k">${t('proj.problem')}</span><p class="detail__v">${esc(tx(p.problem))}</p></div>
          <div class="detail__block"><span class="detail__k">${t('proj.solution')}</span><p class="detail__v">${esc(tx(p.solution))}</p></div>
          <div class="detail__block"><span class="detail__k">${t('proj.result')}</span><p class="detail__v">${esc(tx(p.result))}</p></div>
        </div>
        <div class="card__foot">
          <button class="toggle" data-toggle aria-expanded="${open}">
            <span class="toggle__ico">›</span><span>${open ? t('proj.less') : t('proj.more')}</span>
          </button>
          ${p.demo ? `<button class="card__demo" data-demo="${esc(p.id)}">${t('proj.demo')}</button>` : ''}
          ${(p.links || []).map(l => `<a class="card__link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(tx(l.label))} ↗</a>`).join('')}
        </div>
      </article>`;
    }).join('');
    observeReveals();
  }

  /* ---------------- trajetória ---------------- */
  function renderTimeline() {
    $('#timeline').innerHTML = TIMELINE.map(i => `
      <li class="tl reveal">
        <span class="tl__when">${esc(tx(i.when))}</span>
        <h3 class="tl__title">${esc(tx(i.title))}</h3>
        <p class="tl__body">${esc(tx(i.body))}</p>
      </li>`).join('');
    observeReveals();
  }

  /* ---------------- contato ---------------- */
  function renderContact() {
    const items = [
      { k: t('contact.mail'), v: CONFIG.email,        href: 'mailto:' + CONFIG.email },
      { k: 'GitHub',          v: '@' + CONFIG.githubUser, href: CONFIG.github },
      { k: 'LinkedIn',        v: CONFIG.name,          href: CONFIG.linkedin },
      { k: lang === 'pt' ? 'Localização' : 'Location', v: tx(CONFIG.location), href: null }
    ];
    $('#contactLinks').innerHTML = items.map(i => i.href
      ? `<a class="cbox reveal" href="${esc(i.href)}"${i.href.startsWith('mailto') ? '' : ' target="_blank" rel="noopener"'}>
           <span><span class="cbox__k">${esc(i.k)}</span><span class="cbox__v">${esc(i.v)}</span></span></a>`
      : `<div class="cbox reveal"><span><span class="cbox__k">${esc(i.k)}</span><span class="cbox__v">${esc(i.v)}</span></span></div>`
    ).join('');
    observeReveals();
  }

  /* ---------------- hero: linha digitada ---------------- */
  let typeTimer = null;
  function startTyping() {
    clearTimeout(typeTimer);
    const el = $('#typed');
    const words = TYPED[lang];
    if (REDUCED) { el.textContent = words[0]; return; }
    let w = 0, c = 0, del = false;
    (function step() {
      const word = words[w];
      el.textContent = word.slice(0, c);
      if (!del && c < word.length) { c++; typeTimer = setTimeout(step, 42); }
      else if (!del) { del = true; typeTimer = setTimeout(step, 1900); }
      else if (c > 0) { c--; typeTimer = setTimeout(step, 20); }
      else { del = false; w = (w + 1) % words.length; typeTimer = setTimeout(step, 240); }
    })();
  }

  /* ---------------- hero: terminal ---------------- */
  let termTimer = null;
  function runTerminal() {
    clearTimeout(termTimer);
    const el = $('#termBody');
    const lines = TERM[lang];
    const cls = { cmd: 'c', out: 'o', ok: 'k' };
    if (REDUCED) {
      el.innerHTML = lines.map(l => `<span class="${cls[l.t]}">${esc(l.v)}</span>`).join('\n');
      return;
    }
    el.innerHTML = '';
    let i = 0, j = 0;
    const draw = (partial) => {
      const done = lines.slice(0, i).map(l => `<span class="${cls[l.t]}">${esc(l.v)}</span>`).join('\n');
      const cur = i < lines.length ? `<span class="${cls[lines[i].t]}">${esc(partial)}</span><span class="term__cur"></span>` : '';
      el.innerHTML = done + (done && i < lines.length ? '\n' : '') + cur;
    };
    (function step() {
      if (i >= lines.length) { draw(''); return; }
      const line = lines[i];
      if (j <= line.v.length) { draw(line.v.slice(0, j)); j++; termTimer = setTimeout(step, line.t === 'cmd' ? 34 : 8); }
      else { i++; j = 0; termTimer = setTimeout(step, line.t === 'cmd' ? 260 : 420); }
    })();
  }

  /* ---------------- contadores ---------------- */
  function runCounters() {
    $$('.metric__num').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      if (REDUCED) { el.textContent = target + suffix; return; }
      const dur = 1200, t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  /* ---------------- reveal ---------------- */
  let revealObs = null;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(e => e.classList.add('is-in')); return; }
    if (!revealObs) {
      revealObs = new IntersectionObserver((entries) => {
        entries.forEach((e, n) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('is-in'), REDUCED ? 0 : n * 55);
            revealObs.unobserve(e.target);
          }
        });
      }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    }
    $$('.reveal:not(.is-in)').forEach(el => revealObs.observe(el));
  }

  /* ---------------- filtro ---------------- */
  function setFilter(tech) {
    filter = (filter === tech) ? null : tech;
    renderStack(); renderProjects();
    if (filter) document.getElementById('projetos').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------------- paleta de comandos ---------------- */
  function commands() {
    const go = (id) => () => { document.getElementById(id).scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); };
    const secs = ['sobre', 'stack', 'projetos', 'trajeto', 'contato'];
    const names = { sobre: 'nav.about', stack: 'nav.stack', projetos: 'nav.projects', trajeto: 'nav.path', contato: 'nav.contact' };
    const list = secs.map(s => ({ label: t(names[s]), kind: t('palette.go'), run: go(s) }));

    list.push({ label: 'GitHub — @' + CONFIG.githubUser, kind: t('palette.open'), run: () => window.open(CONFIG.github, '_blank', 'noopener') });
    list.push({ label: 'LinkedIn', kind: t('palette.open'), run: () => window.open(CONFIG.linkedin, '_blank', 'noopener') });
    list.push({ label: CONFIG.email, kind: t('palette.open'), run: () => { window.location.href = 'mailto:' + CONFIG.email; } });
    list.push({ label: t('hero.copyMail'), kind: t('palette.action'), run: copyMail });
    list.push({ label: lang === 'pt' ? 'Switch to English' : 'Mudar para português', kind: t('palette.action'), run: () => { lang = lang === 'pt' ? 'en' : 'pt'; applyLang(); } });

    PROJECTS.filter(p => p.demo).forEach(p => list.push({
      label: tx(p.name) + ' — ' + t('proj.demo'), kind: t('proj.demo'),
      run: () => openDemo(p.id)
    }));

    PROJECTS.forEach(p => list.push({
      label: tx(p.name), kind: lang === 'pt' ? 'Projeto' : 'Project',
      run: () => { openCards.add(p.id); filter = null; renderStack(); renderProjects();
                   const el = document.querySelector(`.card[data-id="${p.id}"]`);
                   if (el) el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' }); }
    }));
    return list;
  }

  let palCmds = [], palSel = 0;

  function openPalette() {
    palCmds = commands(); palSel = 0;
    $('#palette').hidden = false;
    $('#paletteInput').value = '';
    drawPalette('');
    $('#paletteInput').focus();
  }
  function closePalette() { $('#palette').hidden = true; }

  function drawPalette(q) {
    const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const hits = palCmds.filter(c => norm(c.label + ' ' + c.kind).includes(norm(q)));
    palSel = Math.min(palSel, Math.max(hits.length - 1, 0));
    const ul = $('#paletteList');
    ul.innerHTML = hits.length
      ? hits.map((c, i) => `<li role="option" class="${i === palSel ? 'is-sel' : ''}" data-i="${i}">${esc(c.label)}<span class="k">${esc(c.kind)}</span></li>`).join('')
      : `<li class="palette__none">${t('palette.none')}</li>`;
    ul._hits = hits;
  }

  function palRun(i) {
    const hits = $('#paletteList')._hits || [];
    if (hits[i]) { closePalette(); hits[i].run(); }
  }

  /* ---------------- demonstrações ---------------- */

  /* Os dois arquivos das demos só são baixados no primeiro clique em "Demo".
     Juntos passam de 40 KB — mais que o resto do site somado — e quem só lê
     os cartões nunca precisa deles. Carregar sempre seria cobrar de todo
     visitante o custo de um recurso que a maioria não abre. */
  let demosPromessa = null;

  function carregarDemos() {
    if (demosPromessa) return demosPromessa;
    const um = (src) => new Promise((ok, falha) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = ok;
      s.onerror = () => falha(new Error(src));
      document.head.appendChild(s);
    });
    demosPromessa = um('assets/js/demos-sql.js')
      .then(() => um('assets/js/demos.js'))
      .catch((e) => { demosPromessa = null; throw e; });
    return demosPromessa;
  }

  let demoAnterior = null;

  function openDemo(id) {
    const proj = PROJECTS.find(p => p.id === id);
    if (!proj) return;

    demoAnterior = document.activeElement;
    const caixa = $('#demo');
    $('#demoTitulo').textContent = tx(proj.name);
    $('#demoSelo').hidden = true;
    $('#demoNota').hidden = true;
    $('#demoCorpo').textContent = '';
    $('#demoCorpo').appendChild(document.createTextNode(t('demo.loading')));
    caixa.hidden = false;
    document.body.classList.add('is-locked');
    $('#demoFechar').focus();

    carregarDemos().then(() => {
      const d = (window.DEMOS || {})[id];
      const corpo = $('#demoCorpo');
      corpo.textContent = '';
      if (!d) { corpo.appendChild(document.createTextNode(t('demo.failed'))); return; }

      $('#demoTitulo').textContent = tx(proj.name) + ' · ' + tx(d.titulo);
      const selo = $('#demoSelo');
      selo.textContent = tx(d.selo); selo.hidden = false;

      d.montar(corpo, { lang, tx, esc });

      const nota = $('#demoNota');
      nota.textContent = '';
      nota.appendChild(Object.assign(document.createElement('span'), { className: 'demo__notaK', textContent: t('demo.about') }));
      nota.appendChild(document.createTextNode(tx(d.nota)));
      nota.hidden = false;
    }).catch(() => {
      const corpo = $('#demoCorpo');
      corpo.textContent = '';
      corpo.appendChild(document.createTextNode(t('demo.failed') + ' '));
      const btn = document.createElement('button');
      btn.className = 'dm-btn dm-btn--sec';
      btn.textContent = t('demo.retry');
      btn.addEventListener('click', () => openDemo(id));
      corpo.appendChild(btn);
    });
  }

  function closeDemo() {
    const caixa = $('#demo');
    if (caixa.hidden) return;
    caixa.hidden = true;
    /* Zerar o corpo não é faxina: enquanto o nó viver, um <iframe> de demo
       continua com a página de terceiro carregada e um temporizador de
       animação continua rodando atrás do modal fechado. */
    $('#demoCorpo').textContent = '';
    document.body.classList.remove('is-locked');
    if (demoAnterior && demoAnterior.isConnected) demoAnterior.focus();
    demoAnterior = null;
  }

  /* ---------------- utilidades ---------------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('is-on');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  function copyMail() {
    const done = () => toast(t('toast.copied'));
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(CONFIG.email).then(done).catch(() => toast(t('toast.failed')));
    } else {
      const ta = document.createElement('textarea');
      ta.value = CONFIG.email; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast(t('toast.failed')); }
      ta.remove();
    }
  }

  /* ---------------- eventos ---------------- */
  function bind() {
    $('#langBtn').addEventListener('click', () => { lang = lang === 'pt' ? 'en' : 'pt'; applyLang(); });
    $('#copyMail').addEventListener('click', copyMail);
    $('#paletteBtn').addEventListener('click', openPalette);
    $('#filterClear').addEventListener('click', () => { filter = null; renderStack(); renderProjects(); });

    $('#ghBtn').href = CONFIG.github;
    $('#liBtn').href = CONFIG.linkedin;
    $('#year').textContent = new Date().getFullYear();

    document.addEventListener('click', (e) => {
      const tech = e.target.closest('[data-tech]');
      if (tech) { setFilter(tech.dataset.tech); return; }

      const tg = e.target.closest('[data-toggle]');
      if (tg) {
        const card = tg.closest('.card'); const id = card.dataset.id;
        const open = card.classList.toggle('is-open');
        open ? openCards.add(id) : openCards.delete(id);
        tg.setAttribute('aria-expanded', String(open));
        tg.lastElementChild.textContent = open ? t('proj.less') : t('proj.more');
        return;
      }

      const dm = e.target.closest('[data-demo]');
      if (dm) { openDemo(dm.dataset.demo); return; }

      if (e.target.closest('[data-demo-close]')) { closeDemo(); return; }
      if (e.target.closest('[data-close]')) closePalette();

      const li = e.target.closest('#paletteList li');
      if (li) palRun(Number(li.dataset.i));
    });

    $('#paletteInput').addEventListener('input', (e) => { palSel = 0; drawPalette(e.target.value); });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !$('#demo').hidden) { closeDemo(); return; }

      const open = !$('#palette').hidden;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open ? closePalette() : openPalette(); return; }
      if (e.key === '/' && !open && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) { e.preventDefault(); openPalette(); return; }
      if (!open) return;
      if (e.key === 'Escape') { closePalette(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); palSel++; drawPalette($('#paletteInput').value); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); palSel = Math.max(0, palSel - 1); drawPalette($('#paletteInput').value); }
      else if (e.key === 'Enter')     { e.preventDefault(); palRun(palSel); }
    });

    // spotlight
    if (!REDUCED && window.matchMedia('(pointer:fine)').matches) {
      window.addEventListener('pointermove', (e) => {
        const s = $('#spotlight').style;
        s.setProperty('--mx', e.clientX + 'px');
        s.setProperty('--my', e.clientY + 'px');
      }, { passive: true });
    }

    // progresso + nav grudada
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(h.scrollHeight - h.clientHeight, 1);
      $('#progress').style.width = (p * 100) + '%';
      $('#nav').classList.toggle('is-stuck', h.scrollTop > 8);
      if (h.scrollTop < 120) $$('[data-nav]').forEach(l => l.classList.remove('is-active'));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // link ativo na nav
    if ('IntersectionObserver' in window) {
      const links = $$('[data-nav]');
      const spy = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      ['sobre', 'stack', 'projetos', 'trajeto', 'contato'].forEach(id => spy.observe(document.getElementById(id)));

      const mObs = new IntersectionObserver((en) => {
        if (en[0].isIntersecting) { runCounters(); mObs.disconnect(); }
      }, { threshold: .4 });
      mObs.observe($('#metrics'));
    } else { runCounters(); }
  }

  /* ---------------- start ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    bind();
    applyLang();
    observeReveals();
  });
})();
