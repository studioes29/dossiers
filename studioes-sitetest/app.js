/* Studio ES, refonte 2026. Code sans dépendance. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const MOB = () => innerWidth <= 760;
const BASE = /(^|\.)studioes\.fr$/.test(location.hostname) && !location.pathname.includes('sitetest') ? '/' : 'https://studioes.fr/';
const ARR = '<span class="ar"><svg><use href="#arr"/></svg><svg><use href="#arr"/></svg></span>';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const store = {get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const pad = n => String(n).padStart(2, '0');

/* ---------- Images ---------- */
const FMAP = {}; REPS.forEach(r => r.ph.forEach(p => { FMAP[p[0]] = [r, p]; }));
const big = (r, f) => BASE + (r.old ? 'images/' : 'p/') + f + '.jpg';
const sm = (r, f) => BASE + (r.old ? 'images/t/' : 'p/t/') + f + '.webp';
const bigF = f => big(FMAP[f][0], f), smF = f => sm(FMAP[f][0], f);
const heroOf = k => P[k] && P[k].hero ? BASE + P[k].hero.replace('.jpg', '-1600.webp') : null;

/* ---------- Profils ---------- */
P.autre = {t: 'Autre projet', a: 'un autre projet', n: [SITE, OUTIL, SUP, RS, COM()], gr: ['soute', 'identites', 'campagnes'], pf: 'all'};
const ORDER = ['culture', 'collectivite', 'entreprise', 'club', 'particulier', 'autre'];
const PV = {culture: 'p/t/helena-3.webp', collectivite: 'h/collectivite-800.webp', entreprise: 'h/entreprise-800.webp', club: 'h/club-800.webp', particulier: 'h/mariage-800.webp', autre: 'images/t/soute-1.webp'};
const st = {p: null};
{ const s = store.get('ses2'); if (s && P[s]) st.p = s; }
const listeners = [];
const onProfile = f => listeners.push(f);
function setProfile(k, go) {
  st.p = k; store.set('ses2', k);
  listeners.forEach(f => f(k));
  if (go) {
    const t = k === 'autre' ? '#aussi' : '#reportages';
    setTimeout(() => scrollToEl($(t)), 260);
  }
}
function scrollToEl(el) { if (!el) return; const y = el.getBoundingClientRect().top + scrollY; window.scrollTo({top: y, behavior: RM ? 'auto' : 'smooth'}); }
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); closeMenu(); closeViewer(); setTimeout(() => scrollToEl(t), 10); }));

/* ---------- Flou de mouvement (filtre SVG directionnel) ---------- */
function mb(id, from, to, dur, ease = t => 1 - Math.pow(1 - t, 3)) {
  const fe = $('#' + id + ' feGaussianBlur'); if (!fe || RM) return;
  const t0 = performance.now();
  (function tick(now) {
    const t = clamp((now - t0) / dur, 0, 1), v = lerp(from, to, ease(t));
    fe.setAttribute('stdDeviation', v.toFixed(1) + ' 0');
    if (t < 1) requestAnimationFrame(tick);
  })(t0);
}
const anim = (el, kf, o) => el.animate ? el.animate(kf, Object.assign({fill: 'forwards', easing: 'cubic-bezier(.16,1,.3,1)'}, o)) : null;

/* ---------- Intro ---------- */
const root = document.documentElement;
const seen = (() => { try { return sessionStorage.getItem('ses-in'); } catch (e) { return 1; } })();
function ready() { document.body.classList.add('ready'); heroStart(); }
if (seen || RM) { root.classList.add('skip-intro'); requestAnimationFrame(() => requestAnimationFrame(ready)); }
else {
  try { sessionStorage.setItem('ses-in', 1); } catch (e) {}
  setTimeout(() => { $('#intro').classList.add('out'); setTimeout(ready, 250); setTimeout(() => $('#intro').remove(), 1100); }, 1350);
}

/* ---------- En-tête : masqué en descente, teinte selon la section ---------- */
const hd = $('#hd'); let lastY = scrollY;
const creams = $$('.cream');
function headerTick() {
  const y = scrollY;
  hd.classList.toggle('up', y > 200 && y > lastY + 2 && !menuOpen);
  if (y < lastY - 2 || y < 200) hd.classList.remove('up');
  lastY = y;
  const mid = 34; let on = false;
  creams.forEach(s => { const r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom >= mid) on = true; });
  hd.classList.toggle('on-cream', on);
}

/* ---------- Menu ---------- */
const menu = $('#menu'), mbtn = $('#mbtn'); let menuOpen = false;
function openMenu() { menuOpen = true; menu.classList.add('open'); menu.setAttribute('aria-hidden', 'false'); mbtn.setAttribute('aria-expanded', 'true'); root.style.overflow = 'hidden'; $$('.menu li a').forEach((a, i) => a.style.transitionDelay = (.25 + i * .06) + 's'); }
function closeMenu() { if (!menuOpen) return; menuOpen = false; menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true'); mbtn.setAttribute('aria-expanded', 'false'); root.style.overflow = ''; $$('.menu li a').forEach(a => a.style.transitionDelay = '0s'); }
mbtn.onclick = openMenu; $('#menuX').onclick = closeMenu;
{ const pv = $('#menuPv'), im = $('img', pv);
  $$('.menu li a').forEach(a => {
    a.addEventListener('pointerenter', () => { if (!FINE) return; im.src = BASE + a.dataset.pv; pv.classList.add('on'); });
    a.addEventListener('pointerleave', () => pv.classList.remove('on'));
  });
  menu.addEventListener('pointermove', e => { pv.style.left = e.clientX + 'px'; pv.style.top = e.clientY + 'px'; });
}

/* ---------- Curseur viseur ---------- */
const cur = $('#cur');
const C = {x: innerWidth / 2, y: innerHeight / 2, fx: 0, fy: 0, fw: 0, fh: 0, tx: 0, ty: 0, tw: 0, th: 0, el: null};
if (FINE && !RM) {
  root.classList.add('has-cur');
  const dot = $('.dot', cur), fr = $('.fr', cur), lab = $('.lab', cur);
  addEventListener('pointermove', e => {
    C.x = e.clientX; C.y = e.clientY;
    const f = e.target.closest('[data-frame]'), l = e.target.closest('a,button');
    if (f !== C.el) { C.el = f; lab.textContent = f ? f.dataset.frame : ''; }
    cur.classList.toggle('frame', !!f);
    cur.classList.toggle('link', !f && !!l);
  }, {passive: true});
  (function loop() {
    dot.style.transform = `translate(${C.x}px,${C.y}px)`;
    if (C.el) {
      const r = C.el.getBoundingClientRect(), m = 10;
      const w = Math.min(r.width, 150), h = Math.min(r.height, 150);
      C.tx = clamp(C.x - w / 2, r.left - m, r.right + m - w); C.ty = clamp(C.y - h / 2, r.top - m, r.bottom + m - h); C.tw = w; C.th = h;
    } else { C.tx = C.x - 20; C.ty = C.y - 20; C.tw = 40; C.th = 40; }
    C.fx = lerp(C.fx, C.tx, .2); C.fy = lerp(C.fy, C.ty, .2); C.fw = lerp(C.fw, C.tw, .2); C.fh = lerp(C.fh, C.th, .2);
    fr.style.transform = `translate(${C.fx}px,${C.fy}px)`; fr.style.width = C.fw + 'px'; fr.style.height = C.fh + 'px';
    lab.style.left = (C.fx + C.fw) + 'px'; lab.style.top = (C.fy + C.fh) + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ---------- Accueil : diaporama au flou de mouvement ---------- */
const GEN = ['helena-3', 'inaug-square-7', 'kemmler-1', 'pub-petites-folies-5', 'feder-2', 'bushi-1', 'voeux-ph-4', 'sara-lugo-1', 'pub-eucalyptus-11', 'fl-auto-photo-10', 'candeur-cyclone-3', 'forum-asso-4'];
const H = {list: GEN, i: 0, front: 'A', timer: 0, t0: 0, dur: 4600, busy: false};
const hA = $('#hA'), hB = $('#hB'), hT = $('#hT'), hC = $('#hC'), hBar = $('#hBar');
function heroList() { const p = st.p && P[st.p]; return p && p.ph ? p.ph : GEN; }
function heroCap() { const r = FMAP[H.list[H.i]][0]; hT.textContent = r.t; hC.textContent = pad(H.i + 1) + ' / ' + pad(H.list.length); }
function preload(u) { const i = new Image(); i.src = u; return i; }
function heroShow(i, instant) {
  if (H.busy && !instant) return;
  H.i = (i + H.list.length) % H.list.length;
  const f = H.list[H.i], u = bigF(f);
  const front = H.front === 'A' ? hA : hB, back = H.front === 'A' ? hB : hA;
  const fid = H.front === 'A' ? 'mbA' : 'mbB', bid = H.front === 'A' ? 'mbB' : 'mbA';
  heroCap();
  if (instant) { front.src = u; front.style.opacity = 1; back.style.opacity = 0; return; }
  H.busy = true;
  const im = preload(u);
  const go = () => {
    back.src = u; back.style.filter = `url(#${bid})`; front.style.filter = `url(#${fid})`;
    mb(fid, 0, 70, 700); mb(bid, 80, 0, 1100);
    anim(front, [{opacity: 1, transform: 'translateX(0) scale(1.04)'}, {opacity: 0, transform: 'translateX(-6%) scale(1.04)'}], {duration: 750, easing: 'cubic-bezier(.7,0,.3,1)'});
    anim(back, [{opacity: 0, transform: 'translateX(7%) scale(1.08)'}, {opacity: 1, transform: 'translateX(0) scale(1)'}], {duration: 1150, delay: 120});
    setTimeout(() => { front.style.filter = back.style.filter = ''; H.front = H.front === 'A' ? 'B' : 'A'; H.busy = false; kenBurns(back); }, 1300);
    preload(bigF(H.list[(H.i + 1) % H.list.length]));
  };
  im.complete ? go() : (im.onload = go, im.onerror = () => { H.busy = false; });
}
function kenBurns(el) { if (RM) return; anim(el, [{transform: 'scale(1)'}, {transform: 'scale(1.05)'}], {duration: H.dur + 1400, easing: 'linear'}); }
function heroLoop() {
  cancelAnimationFrame(H.timer); H.t0 = performance.now();
  const tick = now => {
    const p = clamp((now - H.t0) / H.dur, 0, 1);
    hBar.style.transform = `scaleX(${p})`;
    if (p >= 1) { if (document.visibilityState === 'visible' && heroVisible) heroShow(H.i + 1); H.t0 = now; }
    H.timer = requestAnimationFrame(tick);
  };
  H.timer = requestAnimationFrame(tick);
}
let heroVisible = true;
new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }).observe($('#accueil'));
function heroStart() {
  H.started = true;
  H.list = heroList(); H.i = 0;
  const u = bigF(H.list[0]); hA.src = u; heroCap(); H.front = 'A';
  if (!RM) { hA.style.filter = 'url(#mbA)'; mb('mbA', 90, 0, 1500); setTimeout(() => hA.style.filter = '', 1600); kenBurns(hA); }
  heroLoop();
}
$('#hOpen').onclick = () => { const r = FMAP[H.list[H.i]][0]; openViewer(r, r.ph.findIndex(p => p[0] === H.list[H.i])); };
onProfile(() => { if (!H.started) return; const l = heroList(); if (l === H.list) return; H.list = l; heroShow(0); H.t0 = performance.now(); });

/* ---------- Bandeau « Vous êtes » ---------- */
const band = $('#band'), whoPv = $('#whoPv');
ORDER.forEach(k => {
  const b = document.createElement('button');
  b.dataset.k = k; b.innerHTML = `<span>${P[k].t}</span><svg viewBox="0 0 16 16" aria-hidden="true"><use href="#arr"/></svg>`;
  b.onclick = () => setProfile(st.p === k ? null : k, st.p !== k);
  b.addEventListener('pointerenter', e => { if (!FINE) return; $('img', whoPv).src = BASE + PV[k]; whoPv.classList.add('on'); });
  b.addEventListener('pointerleave', () => whoPv.classList.remove('on'));
  b.addEventListener('pointermove', e => { whoPv.style.left = e.clientX + 'px'; whoPv.style.top = e.clientY + 'px'; });
  band.appendChild(b);
});
const who = $('#who');
function bandSync(k) {
  $$('button', band).forEach(b => b.classList.toggle('on', b.dataset.k === k));
  who.classList.toggle('on', !!k); $('#whoT').textContent = k ? P[k].t : '';
}
who.onclick = () => { setProfile(null); scrollToEl($('#accueil')); };
onProfile(bandSync);

/* ---------- Reportages ---------- */
const FL = [['all', 'Tout'], ['scene', 'Scène'], ['public', 'Festivals et public'], ['corp', 'Institutions et entreprises']];
const PHOTO_REPS = REPS.filter(r => r.k !== 'g');
const G = {f: 'all', all: false};
const grid = $('#grid'), flt = $('#flt');
FL.forEach(([k, l]) => {
  const n = k === 'all' ? PHOTO_REPS.length : PHOTO_REPS.filter(r => r.k === k).length;
  const b = document.createElement('button'); b.dataset.f = k; b.setAttribute('role', 'tab');
  b.innerHTML = `${l}<sup>${n}</sup>`; b.onclick = () => { G.f = k; G.all = false; renderGrid(); };
  flt.appendChild(b);
});
$('#repN').textContent = PHOTO_REPS.length;
// rythme de la grille : [colonnes sur 12, format], hauteurs égales par rangée
const PAT = [[8, 1.6], [4, .8], [4, .8], [4, .8], [4, .8], [5, .8], [7, 1.12], [4, .8], [8, 1.6]];
const PATM = [[2, 1.25], [1, .8], [1, .8]];
function cover(r, ar) { let best = r.ph[0], d = 9; r.ph.forEach(p => { const x = Math.abs(Math.log(p[1] / ar)); if (x < d - .15) { d = x; best = p; } }); return best[0]; }
function renderGrid() {
  $$('button', flt).forEach(b => b.classList.toggle('on', b.dataset.f === G.f));
  let list = G.f === 'all' ? PHOTO_REPS.slice() : PHOTO_REPS.filter(r => r.k === G.f);
  if (st.p && P[st.p].pf && G.f === 'all') { const pf = P[st.p].pf; list.sort((a, b) => (b.k === pf) - (a.k === pf)); }
  const LIM = 9, show = G.all ? list : list.slice(0, LIM);
  $('#moreB').parentElement.style.display = list.length > LIM && !G.all ? '' : 'none';
  $('#moreT').textContent = `Tous les reportages (${list.length})`;
  const mob = MOB();
  grid.innerHTML = show.map((r, i) => {
    const [s, ar] = mob ? PATM[i % 3] : PAT[i % PAT.length];
    const f = cover(r, ar);
    return `<button class="card" data-id="${r.id}" data-frame="Ouvrir" style="--s:${s};--sm:${s};--ar:${ar}"><span class="im"><img src="${sm(r, f)}" alt="${esc(r.t)}" loading="lazy" decoding="async"><span class="tk">${r.ph.slice(0, 14).map(() => '<s></s>').join('')}</span></span><span class="ti"><b>${esc(r.t)}</b><span>${r.ph.length} images</span></span></button>`;
  }).join('');
  $$('.card', grid).forEach((c, i) => { c.style.transitionDelay = (i % 3) * .08 + 's'; io.observe(c); bindCard(c); });
}
function bindCard(c) {
  const r = REPS.find(x => x.id === c.dataset.id), img = $('img', c), tks = $$('.tk s', c), n = Math.min(r.ph.length, 14);
  const orig = img.src; let last = -1;
  c.onclick = () => openViewer(r, last < 0 ? 0 : last);
  if (!FINE) return;
  c.addEventListener('pointerenter', () => r.ph.slice(0, n).forEach(p => preload(sm(r, p[0]))));
  c.addEventListener('pointermove', e => {
    const b = c.getBoundingClientRect(), i = clamp(Math.floor((e.clientX - b.left) / b.width * n), 0, n - 1);
    if (i === last) return; last = i; img.src = sm(r, r.ph[i][0]);
    tks.forEach((t, j) => t.classList.toggle('on', j === i));
  });
  c.addEventListener('pointerleave', () => { last = -1; img.src = orig; tks.forEach(t => t.classList.remove('on')); });
}
$('#moreB').onclick = () => { G.all = true; renderGrid(); };
onProfile(k => { if (k && P[k].pf && P[k].pf !== 'all') G.f = 'all'; renderGrid(); });

/* ---------- Visionneuse ---------- */
const vw = $('#vw'), vwI = $('#vwI'), strip = $('#strip');
const V = {r: null, i: 0, open: false, busy: false};
function openViewer(r, i = 0) {
  V.r = r; V.i = clamp(i, 0, r.ph.length - 1); V.open = true;
  $('#vwT').innerHTML = `${esc(r.t)}<span id="vwK"></span>`;
  strip.innerHTML = r.ph.map((p, j) => `<button style="--ar:${p[1]}" data-j="${j}" aria-label="Image ${j + 1}"><img src="${sm(r, p[0])}" alt="" loading="lazy"></button>`).join('');
  $$('button', strip).forEach(b => b.onclick = () => vShow(+b.dataset.j));
  vw.classList.add('open'); root.style.overflow = 'hidden';
  vShow(V.i, true);
}
function closeViewer() { if (!V.open) return; V.open = false; vw.classList.remove('open'); root.style.overflow = ''; }
function vShow(i, first) {
  const r = V.r, n = r.ph.length; if (V.busy && !first) return;
  const dir = i > V.i ? 1 : -1; V.i = (i + n) % n;
  const p = r.ph[V.i], u = big(r, p[0]);
  $('#vwK').textContent = pad(V.i + 1) + ' / ' + pad(n);
  $('#vwC').textContent = p[2] || '';
  $$('button', strip).forEach((b, j) => { b.classList.toggle('on', j === V.i); if (j === V.i) b.scrollIntoView({block: 'nearest', inline: 'center', behavior: first ? 'auto' : 'smooth'}); });
  if (first || RM) { vwI.src = u; vwI.alt = r.t; if (!RM) { vwI.style.filter = 'url(#mbV)'; mb('mbV', 60, 0, 800); anim(vwI, [{opacity: 0, transform: 'scale(.96)'}, {opacity: 1, transform: 'none'}], {duration: 800}); } return; }
  V.busy = true;
  const im = preload(u);
  vwI.style.filter = 'url(#mbV)'; mb('mbV', 0, 60, 300);
  const out = anim(vwI, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: `translateX(${-dir * 8}%)`}], {duration: 300, easing: 'cubic-bezier(.7,0,.3,1)'});
  const go = () => {
    vwI.src = u;
    mb('mbV', 60, 0, 650);
    anim(vwI, [{opacity: 0, transform: `translateX(${dir * 8}%)`}, {opacity: 1, transform: 'none'}], {duration: 700});
    setTimeout(() => { V.busy = false; }, 420);
    preload(big(r, r.ph[(V.i + 1) % n][0]));
  };
  setTimeout(() => im.complete ? go() : (im.onload = im.onerror = go), 300);
}
$('#vwX').onclick = closeViewer;
$('#vwP').onclick = () => vShow(V.i - 1);
$('#vwN').onclick = () => vShow(V.i + 1);
$('#vwCt').addEventListener('click', closeViewer);
addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeViewer(); closeMenu(); closeMl(); }
  if (!V.open) return;
  if (e.key === 'ArrowRight') vShow(V.i + 1);
  if (e.key === 'ArrowLeft') vShow(V.i - 1);
});
{ let sx = 0, sy = 0; const m = $('#vwM');
  m.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive: true});
  m.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) vShow(V.i + (dx < 0 ? 1 : -1)); }, {passive: true});
}

/* ---------- Brut / retouché ---------- */
const BA = ['lf0008', 'ge0091', 'lf0157', 'ge0128', 'lf0031', 'ge0092', 'lf0092'];
let baI = 0; const ba = $('#ba');
function baSet(i) { baI = (i + BA.length) % BA.length; $('#baB').src = BASE + 'b/' + BA[baI] + '-brut.webp'; $('#baA').src = BASE + 'b/' + BA[baI] + '-retouche.webp'; }
baSet(0);
{ let drag = false;
  const mv = x => { const r = ba.getBoundingClientRect(); ba.style.setProperty('--x', clamp((x - r.left) / r.width * 100, 0, 100) + '%'); };
  ba.addEventListener('pointerdown', e => { drag = true; ba.setPointerCapture(e.pointerId); mv(e.clientX); });
  ba.addEventListener('pointermove', e => { if (drag || (FINE && e.pointerType === 'mouse')) mv(e.clientX); });
  ba.addEventListener('pointerup', () => drag = false);
  ba.addEventListener('pointerleave', () => { if (FINE) { drag = false; } });
}
$('#baNext').onclick = () => {
  if (RM) return baSet(baI + 1);
  ba.style.filter = 'url(#mbV)'; mb('mbV', 0, 50, 260);
  anim(ba, [{opacity: 1}, {opacity: 0}], {duration: 260});
  setTimeout(() => { baSet(baI + 1); ba.style.setProperty('--x', '50%'); mb('mbV', 50, 0, 600); anim(ba, [{opacity: 0}, {opacity: 1}], {duration: 600}); setTimeout(() => ba.style.filter = '', 650); }, 280);
};

/* ---------- Graphisme : piste horizontale épinglée ---------- */
const track = $('#track'), gx = $('#graphisme');
function renderTrack() {
  const all = REPS.filter(r => r.k === 'g');
  const pref = st.p && P[st.p].gr ? P[st.p].gr : ['soute', 'marelle', 'identites', 'campagnes', 'signaletique', 'ellipse'];
  all.sort((a, b) => { const ia = pref.indexOf(a.id), ib = pref.indexOf(b.id); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
  track.innerHTML = all.map(r => {
    const ar = clamp(r.ph[0][1], .62, 1.65);
    return `<button class="gc" data-id="${r.id}" data-frame="Feuilleter" style="--ar:${ar}"><span class="im"><img src="${sm(r, r.ph[0][0])}" alt="${esc(r.t)}" loading="lazy" decoding="async"></span><span class="ti"><b>${esc(r.t)}</b><span>${r.ph.length}</span></span></button>`;
  }).join('') + `<div class="gx-end"><p>Un projet graphique à lancer&#8239;?</p><a class="pill" href="#estimation"><span>Estimer</span>${ARR}</a></div>`;
  $$('.gc', track).forEach(c => {
    const r = REPS.find(x => x.id === c.dataset.id), im = $('.im', c);
    c.onclick = () => openViewer(r, 0);
    if (FINE) {
      c.addEventListener('pointermove', e => { const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; im.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateZ(10px)`; });
      c.addEventListener('pointerleave', () => im.style.transform = '');
    }
  });
  $$('a[href^="#"]', track).forEach(a => a.addEventListener('click', e => { e.preventDefault(); scrollToEl($(a.getAttribute('href'))); }));
  sizeTrack();
}
function sizeTrack() {
  if (MOB()) { gx.style.height = ''; return; }
  const extra = Math.max(0, track.scrollWidth - innerWidth);
  gx.style.height = (innerHeight + extra) + 'px';
}
function trackTick() {
  if (MOB()) return;
  const r = gx.getBoundingClientRect(), extra = Math.max(0, track.scrollWidth - innerWidth);
  const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
  track.style.transform = `translate3d(${-extra * p}px,0,0)`;
}
onProfile(renderTrack);

/* ---------- Plan large ---------- */
const GENT = [
  [['Un concert, un spectacle', 250], ['Une inauguration, une cérémonie', 370], ['Un événement d\'entreprise', 370], ['Un mariage', 1290]],
  [['Le reportage et une campagne d\'événement', 280], ['Une identité, une brochure de saison', 550], ['Une campagne de communication', 830]],
  [['Une saison de concerts ou d\'événements', 1190], ['Un photographe toute l\'année', 1390], ['Vos réseaux sociaux suivis', 240, 'mois']]
];
function fromPrice(n) {
  let lo = Infinity, unit = '';
  (n.calc[0].o || []).forEach(o => { if (o[1] != null && o[1] > 0 && o[1] < lo) { lo = o[1]; unit = o[2] || ''; } });
  return lo === Infinity ? 'Sur devis' : `Dès ${fmt(lo)} €${unit ? ' ' + UNIT[unit].replace('par ', '/ ') : ''}`;
}
const steps = $('#steps'), tiers = $('#tiers');
steps.innerHTML = PAL.map((x, i) => `<button data-i="${i}">${x[0]}<i></i></button>`).join('');
function renderTiers() {
  const p = st.p && P[st.p];
  tiers.innerHTML = PAL.map((x, i) => {
    let rows;
    if (p) rows = p.n.filter(n => n.pal === i).map(n => [n.l, fromPrice(n)]);
    if (!rows || !rows.length) rows = GENT[i].map(g => [g[0], `Dès ${fmt(g[1])} €${g[2] ? ' / ' + g[2] : ''}`]);
    return `<div class="tier" data-i="${i}"><h3>${x[0]}</h3><p class="tl">${x[1]}</p><ul>${rows.slice(0, 4).map(r => `<li>${esc(r[0])}<span>${r[1]}</span></li>`).join('')}</ul><a class="pill line" href="#estimation"><span>Estimer ce palier</span>${ARR}</a></div>`;
  }).join('');
  $$('a', tiers).forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); estFromPal(i); scrollToEl($('#estimation')); }));
  const img = $('#plImg'); img.src = (st.p && heroOf(st.p)) || BASE + 'h/festival-1600.webp';
  plTier = -1; plTick();
}
const pl = $('#offre'), stage = $('#stage'); let plTier = -1;
function plTick() {
  const r = pl.getBoundingClientRect();
  const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
  const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  stage.style.setProperty('--p', e.toFixed(4));
  $('#mm').textContent = Math.round(85 - 61 * e) + ' mm';
  const t = p < .34 ? 0 : p < .67 ? 1 : 2;
  $$('button', steps).forEach((b, i) => b.style.setProperty('--f', clamp((p - i / 3) * 3, 0, 1)));
  if (t !== plTier) { plTier = t; $$('.tier', tiers).forEach((x, i) => x.classList.toggle('on', i === t)); $$('button', steps).forEach((b, i) => b.classList.toggle('on', i === t)); }
}
steps.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const i = +b.dataset.i; const top = pl.offsetTop + (pl.offsetHeight - innerHeight) * (i / 3 + .16); window.scrollTo({top, behavior: 'smooth'}); });
onProfile(renderTiers);

/* ---------- Estimation ---------- */
const E = {n: 0, picks: []};
const qs = $('#qs');
function needs() { return st.p ? P[st.p].n : null; }
function initPicks() { const n = needs(); if (!n) return; const c = n[E.n].calc; E.picks = c.map((g, i) => g.m ? [] : [0]); }
function estFromPal(i) { const n = needs(); if (!n) return; const j = n.findIndex(x => x.pal === i); if (j >= 0) { E.n = j; initPicks(); renderEst(); } }
function renderEst() {
  const n = needs();
  let h = `<div class="q"><h3><span class="it">Vous êtes</span></h3><div class="ch" data-q="p">${ORDER.map(k => `<button data-v="${k}" class="${st.p === k ? 'on' : ''}">${P[k].t}</button>`).join('')}</div></div>`;
  if (n) {
    h += `<div class="q"><h3><span class="it">Vous cherchez</span></h3><div class="ch" data-q="n">${n.map((x, i) => `<button data-v="${i}" class="${E.n === i ? 'on' : ''}">${x.l}</button>`).join('')}</div></div>`;
    n[E.n].calc.forEach((g, gi) => {
      h += `<div class="q"><h3><span class="it">${g.q}</span>${g.m ? 'au choix' : ''}</h3><div class="ch" data-q="g" data-g="${gi}">${g.o.map((o, oi) => `<button data-v="${oi}" class="${(E.picks[gi] || []).includes(oi) ? 'on' : ''}">${o[0]}${g.m && o[1] ? `<em>+${fmt(o[1])} €</em>` : ''}</button>`).join('')}</div></div>`;
    });
  }
  qs.innerHTML = h;
  showRes();
}
qs.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const box = b.parentElement, q = box.dataset.q, v = b.dataset.v;
  if (q === 'p') { E.n = 0; setProfile(v); return; }
  if (q === 'n') { E.n = +v; initPicks(); renderEst(); return; }
  const gi = +box.dataset.g, g = needs()[E.n].calc[gi], oi = +v;
  if (g.m) { const a = E.picks[gi] || []; E.picks[gi] = a.includes(oi) ? a.filter(x => x !== oi) : a.concat(oi); }
  else E.picks[gi] = [oi];
  $$('button', box).forEach(x => x.classList.toggle('on', (E.picks[gi] || []).includes(+x.dataset.v)));
  showRes();
});
let shown = 0;
function countTo(el, from, to, fmtF) {
  if (RM || from === to) { el.textContent = fmtF(to); return; }
  const t0 = performance.now(), d = 700;
  (function tk(now) { const t = clamp((now - t0) / d, 0, 1), v = Math.round(lerp(from, to, 1 - Math.pow(1 - t, 4)) / 10) * 10; el.textContent = fmtF(t < 1 ? v : to); if (t < 1) requestAnimationFrame(tk); })(t0);
}
function curEst() { const n = needs(); return n ? estimate(n[E.n].calc, E.picks) : null; }
function showRes() {
  const n = needs(), rN = $('#rN'), e = curEst();
  if (!n) { $('#rK').textContent = 'Votre estimation'; rN.textContent = '…'; $('#rU').textContent = 'Choisissez votre profil pour commencer.'; $('#rS').innerHTML = ''; return; }
  $('#rK').textContent = n[E.n].l;
  if (!e.lo) { rN.textContent = 'Sur devis'; shown = 0; }
  else { const lo = e.lo; countTo(rN, shown, lo, v => `${fmt(v)} à ${fmt(up50(v * 1.2))} €`); shown = lo; }
  $('#rU').textContent = e.lo ? (e.unit ? UNIT[e.unit].replace(/^p/, 'P') : 'Prestation ponctuelle') + (e.devis ? ', plus une partie sur devis' : '') : 'Un échange suffit pour chiffrer.';
  $('#rS').innerHTML = e.labels.map(l => `<li>${esc(l)}</li>`).join('');
}
$('#toDevis').onclick = () => {
  const n = needs(), e = curEst();
  if (n) $('#fM').value = `Bonjour,\n\nJe vous contacte pour ${n[E.n].ph}.\n${e.labels.join('\n')}\nEstimation affichée : ${rangeText(e)}.\n\n`;
  scrollToEl($('#contact')); setTimeout(() => $('#fM').focus({preventScroll: true}), 900);
};
onProfile(k => { if (k) { E.n = 0; initPicks(); } renderEst(); $('#fP').value = k ? P[k].t : ''; });

/* ---------- Formulaire ---------- */
$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, ok = $('#fOk');
  if (!f.name.value.trim() || !/\S+@\S+\.\S+/.test(f.email.value) || !f.message.value.trim()) { ok.textContent = 'Merci de renseigner votre nom, votre e-mail et votre projet.'; return; }
  $('#sendT').textContent = 'Envoi…';
  try {
    const d = Object.fromEntries(new FormData(f)); d._subject = 'Nouveau message depuis studioes.fr'; d._template = 'table';
    const r = await fetch('https://formsubmit.co/ajax/contact@studioes.fr', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(d)});
    if (!r.ok) throw 0;
    f.reset(); ok.textContent = 'Merci, votre message est bien parti. Réponse sous 48 h.'; $('#sendT').textContent = 'Envoyé';
  } catch (err) { ok.textContent = 'L\'envoi n\'a pas abouti. Écrivez directement à contact@studioes.fr.'; $('#sendT').textContent = 'Envoyer'; }
});

/* ---------- Mentions ---------- */
const ml = $('#ml');
function closeMl() { ml.classList.remove('open'); }
$('#mlB').onclick = () => ml.classList.add('open');
$('#mlX').onclick = closeMl;
ml.addEventListener('click', e => { if (e.target === ml) closeMl(); });

/* ---------- Apparitions ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -8% 0px'});
$$('[data-r],.sl').forEach(el => io.observe(el));
$$('.sl').forEach(el => { const s = el.closest('h2'); const k = s ? [...s.querySelectorAll('.sl')].indexOf(el) : 0; el.firstElementChild.style.transitionDelay = k * .1 + 's'; });

/* pied : le nom remonte lettre par lettre */
const ftW = $('#ftW'); ftW.innerHTML = 'Studio ES'.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
const ftS = $$('span', ftW);
function ftTick() {
  const r = ftW.getBoundingClientRect(), p = clamp((innerHeight - r.top) / (r.height * 1.1), 0, 1);
  ftS.forEach((s, i) => { const k = clamp(1 - (p * 1.5 - i * .05), 0, 1); s.style.setProperty('--k', k.toFixed(3)); });
}

/* ---------- Boucle de défilement ---------- */
let tick = false;
function onScroll() { if (tick) return; tick = true; requestAnimationFrame(() => { headerTick(); trackTick(); plTick(); ftTick(); tick = false; }); }
addEventListener('scroll', onScroll, {passive: true});
let lastW = innerWidth;
addEventListener('resize', () => { sizeTrack(); onScroll(); if ((lastW <= 760) !== (innerWidth <= 760)) renderGrid(); lastW = innerWidth; });

/* ---------- Départ ---------- */
setProfile(st.p);
onScroll();
addEventListener('load', () => { sizeTrack(); onScroll(); });
})();
