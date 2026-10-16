/* Studio ES, refonte 2026. Code sans dépendance. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const W = () => innerWidth;
const BASE = 'https://studioes.fr/';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const store = {get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const pad = n => String(n).padStart(2, '0');
const ico = (id, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const preload = u => { const i = new Image(); i.decoding = 'async'; i.src = u; return i; };
const anim = (el, kf, o) => el.animate ? el.animate(kf, Object.assign({fill: 'forwards', easing: 'cubic-bezier(.16,1,.3,1)'}, o)) : null;

/* ---------- Données ---------- */
const FMAP = {}; REPS.forEach(r => r.ph.forEach(p => { FMAP[p[0]] = [r, p]; }));
const big = (r, f) => BASE + (r.old ? 'images/' : 'p/') + f + '.jpg';
const sm = (r, f) => BASE + (r.old ? 'images/t/' : 'p/t/') + f + '.webp';
const bigF = f => big(FMAP[f][0], f), smF = f => sm(FMAP[f][0], f);
const PHR = REPS.filter(r => r.k !== 'g'), GRR = REPS.filter(r => r.k === 'g');
const CAT = r => r.k === 'scene' ? 'Concert' : r.k === 'public' ? 'Festival' : r.k === 'g' ? 'Graphisme' : r.id.startsWith('fl-auto') ? 'Entreprise' : 'Collectivité';
P.autre = {t: 'Autre projet', n: [SITE, OUTIL, SUP, RS, COM()]};
const EST_ORDER = ['culture', 'collectivite', 'entreprise', 'club', 'particulier', 'autre'];
const TABS = [['all', 'Pour vous'], ['culture', 'Concerts et festivals'], ['collectivite', 'Collectivités'], ['entreprise', 'Entreprises'], ['club', 'Clubs et assos'], ['particulier', 'Mariages']];

/* ---------- État ---------- */
const st = {p: 'all'};
{ const s = store.get('ses3'); if (s && TABS.some(t => t[0] === s)) st.p = s; }
const seen = new Set((store.get('ses3-seen') || '').split(',').filter(Boolean));
const L = [];
const on = f => L.push(f);
function setP(k) { st.p = k; store.set('ses3', k); L.forEach(f => f(k)); }

/* ---------- Flou de mouvement directionnel ---------- */
function mb(id, from, to, dur) {
  const fe = $('#' + id + ' feGaussianBlur'); if (!fe || RM) return;
  const t0 = performance.now();
  (function tk(now) { const t = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - t, 3); fe.setAttribute('stdDeviation', lerp(from, to, e).toFixed(1) + ' 0'); if (t < 1) requestAnimationFrame(tk); })(t0);
}

/* ---------- Défilement doux vers une ancre ---------- */
function goTo(el) { if (!el) return; window.scrollTo({top: el.getBoundingClientRect().top + scrollY - (el.id === 'accueil' ? 0 : 10), behavior: RM ? 'auto' : 'smooth'}); }
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const t = $(a.getAttribute('href')); if (!t) return;
  e.preventDefault(); closeSheets(); closeSV(); goTo(t);
});

/* ================= ACCUEIL ================= */
const HERO = ['la-fouine-5', 'la-fouine-2', 'rimk-2', 'danakil-2', 'mentissa-3', 'genezio-2', 'ramoneurs-2'];
const H = {i: 0, front: 'A', busy: false, t0: 0, dur: 5200};
const pA = $('#pA'), pB = $('#pB'), amb = $('#amb'), hPr = $('#hPr');
function heroMeta() {
  const f = HERO[H.i], r = FMAP[f][0];
  $('#hT').textContent = r.t; $('#hK').textContent = CAT(r) + ' · ' + pad(H.i + 1) + '/' + pad(HERO.length);
  $('#hTh').src = smF(f); amb.style.backgroundImage = `url(${smF(f)})`;
}
function heroNext() {
  if (H.busy) return; H.busy = true;
  H.i = (H.i + 1) % HERO.length;
  const u = bigF(HERO[H.i]), im = preload(u);
  const fr = H.front === 'A' ? pA : pB, bk = H.front === 'A' ? pB : pA, fid = H.front === 'A' ? 'mbA' : 'mbB', bid = H.front === 'A' ? 'mbB' : 'mbA';
  const go = () => {
    bk.src = u; heroMeta();
    fr.style.filter = `url(#${fid})`; bk.style.filter = `url(#${bid})`;
    mb(fid, 0, 90, 700); mb(bid, 110, 0, 1200);
    anim(fr, [{opacity: 1, transform: 'translateX(0) scale(1.03)'}, {opacity: 0, transform: 'translateX(-9%) scale(1.03)'}], {duration: 750, easing: 'cubic-bezier(.7,0,.3,1)'});
    anim(bk, [{opacity: 0, transform: 'translateX(10%) scale(1.06)'}, {opacity: 1, transform: 'translateX(0) scale(1)'}], {duration: 1250, delay: 100});
    setTimeout(() => { fr.style.filter = bk.style.filter = ''; H.front = H.front === 'A' ? 'B' : 'A'; H.busy = false; }, 1400);
    preload(bigF(HERO[(H.i + 1) % HERO.length]));
  };
  im.complete ? go() : (im.onload = go, im.onerror = () => { H.busy = false; });
}
let heroVis = true;
new IntersectionObserver(es => { heroVis = es[0].isIntersecting; }).observe($('#accueil'));
function heroLoop(now) {
  if (!H.t0) H.t0 = now;
  const p = clamp((now - H.t0) / H.dur, 0, 1);
  hPr.style.transform = `scaleX(${p})`;
  if (p >= 1) { H.t0 = now; if (heroVis && document.visibilityState === 'visible') heroNext(); }
  requestAnimationFrame(heroLoop);
}
pA.src = bigF(HERO[0]); heroMeta(); preload(bigF(HERO[1]));
const start = () => {
  document.body.classList.add('go');
  if (!RM) { pA.style.filter = 'url(#mbA)'; mb('mbA', 120, 0, 1600); anim(pA, [{opacity: 0, transform: 'translateX(6%) scale(1.08)'}, {opacity: 1, transform: 'none'}], {duration: 1600}); setTimeout(() => pA.style.filter = '', 1700); }
  requestAnimationFrame(heroLoop);
};
pA.complete ? requestAnimationFrame(start) : (pA.onload = start, setTimeout(() => document.body.classList.contains('go') || start(), 2500));
$('#hCard').onclick = () => { const f = HERO[H.i], r = FMAP[f][0]; openSV(PHR, PHR.indexOf(r), r.ph.findIndex(p => p[0] === f)); };
{ const names = [...new Set(REPS.filter(r => r.k === 'scene' || r.k === 'public').map(r => r.t))];
  const s = names.map(n => `<span>${esc(n)}</span>`).join('');
  $('#mq').innerHTML = s + s; }

/* ================= REPORTAGES ================= */
/* ordre du fil selon le profil : on alterne les familles pour que chacun s'y retrouve */
const isCol = r => r.k === 'corp' && !r.id.startsWith('fl-auto');
const GROUPS = {
  all: [r => r.k === 'scene', r => r.k === 'public', r => r.k === 'corp'],
  culture: [r => r.k === 'scene', r => r.k === 'public'],
  collectivite: [isCol, r => r.k === 'public', r => r.k === 'scene'],
  entreprise: [r => r.id.startsWith('fl-auto'), r => r.k === 'corp', r => r.k === 'scene'],
  club: [r => r.k === 'public', r => r.id === 'forum-asso', r => r.k === 'scene'],
  particulier: [r => r.k === 'public', r => r.k === 'scene']
};
function order(k) {
  const gs = GROUPS[k] || GROUPS.all, used = new Set(), lists = gs.map(g => PHR.filter(r => g(r)));
  const out = []; let go = true, i = 0;
  while (go) { go = false; lists.forEach(l => { const r = l[i]; if (r && !used.has(r.id)) { used.add(r.id); out.push(r); go = true; } else if (r) go = true; }); i++; }
  PHR.forEach(r => { if (!used.has(r.id)) out.push(r); });
  return out;
}

/* stories */
const stories = $('#stories');
let ORD = order(st.p);
function renderStories() {
  stories.innerHTML = ORD.map((r, i) => `<button class="sto${seen.has(r.id) ? ' seen' : ''}" data-i="${i}" style="transition-delay:${Math.min(i, 12) * 40}ms"><span class="ring"><span><img src="${sm(r, r.ph[0][0])}" alt="" loading="lazy"></span></span><b>${esc(r.t)}</b></button>`).join('');
  $$('.sto', stories).forEach(b => b.onclick = () => openSV(ORD, +b.dataset.i, 0));
}

/* onglets */
const tabs = $('#tabs'), ink = $('#ink');
tabs.insertAdjacentHTML('beforeend', TABS.map(([k, l]) => `<button role="tab" data-k="${k}">${l}</button>`).join(''));
function moveInk() { const b = $(`button[data-k="${st.p}"]`, tabs); if (!b) return; ink.style.width = b.offsetWidth + 'px'; ink.style.transform = `translateX(${b.offsetLeft}px)`; $$('button', tabs).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); const sl = b.offsetLeft - (tabs.clientWidth - b.offsetWidth) / 2; tabs.scrollTo({left: sl, behavior: 'smooth'}); }
tabs.addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (b && b.dataset.k !== st.p) setP(b.dataset.k); });

/* fil */
const feed = $('#feed');
// tailles : [colonnes sur 12, rangées, colonnes sur 6, colonnes mobile, rangées mobile]
const SZ = {L: [6, 4, 6, 2, 2], M: [3, 2, 3, 1, 1], T: [3, 3, 3, 1, 1], W: [6, 3, 6, 2, 1], Q: [4, 3, 3, 1, 1], H: [6, 2, 6, 2, 1]};
const SEQ = ['L', 'M', 'stat', 'M', 'M', 'W', 'ba', 'T', 'Q', 'Q', 'Q', 'dc', 'M', 'M', 'L', 'M', 'M', 'M', 'M'];
const SEQ2 = ['W', 'T', 'T', 'Q', 'Q', 'Q', 'M', 'M', 'M', 'M'];
const F = {all: false};
function cardPhoto(r, s) {
  const z = SZ[s], f = r.ph.find(p => s === 'L' || s === 'T' || s === 'Q' || s === 'M' ? p[1] < 1.2 : p[1] > 1.2) || r.ph[0];
  return `<button class="c ph" data-r="${r.id}" data-sz="${s}" style="--cw:${z[0]};--ch:${z[1]};--tw:${z[2]};--mw:${z[3]};--mh:${z[4]}">
    <img class="bgi" src="${sm(r, f[0])}" alt="" loading="lazy" decoding="async">
    <span class="bars">${r.ph.slice(0, 5).map(() => '<s><i></i></s>').join('')}</span>
    <span class="chip glass"><i></i>${CAT(r)}</span><span class="cnt glass">${r.ph.length} photos</span>
    <span class="bot"><h3>${esc(r.t)}</h3><span class="ic">${ico('ne')}</span></span></button>`;
}
function renderFeed() {
  ORD = order(st.p); renderStories();
  const items = [], lim = F.all ? 999 : 16; let ri = 0, si = 0;
  while (ri < ORD.length && ri < lim) {
    const s = si < SEQ.length ? SEQ[si] : SEQ2[(si - SEQ.length) % SEQ2.length]; si++;
    if (s === 'stat' || s === 'ba' || s === 'dc') { items.push({k: s}); continue; }
    const left = Math.min(ORD.length, lim) - ri;
    items.push({r: ORD[ri++], s: left < 4 && si > SEQ.length ? 'M' : s});
  }
  $('#feedMore').style.display = F.all || ORD.length <= lim ? 'none' : '';
  $('#feedMore').firstChild.textContent = `Voir tous les reportages (${ORD.length}) `;
  const nPh = PHR.reduce((a, r) => a + r.ph.length, 0);
  feed.innerHTML = items.map(it => {
    if (it.r) return cardPhoto(it.r, it.s);
    if (it.k === 'stat') return `<div class="c k-stat" style="--cw:3;--ch:2;--tw:3;--mw:1;--mh:1"><b>${PHR.length}</b><p>reportages en ligne,<br><span class="se">${nPh} images retouchées une à une.</span></p></div>`;
    if (it.k === 'ba') return `<div class="c k-ba" id="ba" style="--cw:3;--ch:3;--tw:3;--mw:2;--mh:2" aria-label="Comparer la photo brute et la photo retouchée"><img id="baB" alt="Photo brute"><img class="af" id="baA" alt="Photo retouchée"><span class="tt glass">Brut, puis retouché</span><button class="ic glass nx" id="baN" aria-label="Autre exemple">${ico('nx')}</button><span class="hd"><i>${ico('lr')}</i></span><span class="tg l glass">Brut</span><span class="tg r glass">Retouché</span></div>`;
    return `<a class="c k-dc" href="https://declic.studioes.fr" target="_blank" rel="noopener" style="--cw:6;--ch:2;--tw:6;--mw:2;--mh:1"><span class="tx"><b>Trois scènes, un seul déclic.</b><span>Un mini-jeu, pour se mettre dans la peau du photographe.</span></span><img src="${BASE}a/declic.webp" alt="" loading="lazy"></a>`;
  }).join('');
  $$('.c', feed).forEach((c, i) => { c.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(c); });
  $$('.c.ph', feed).forEach(bindCard);
  if ($('#ba')) bindBA();
}
function bindCard(c) {
  const r = REPS.find(x => x.id === c.dataset.r), img = $('.bgi', c), bars = $$('.bars s i', c), n = bars.length;
  c.onclick = () => openSV(ORD, ORD.indexOf(r), 0);
  if (!FINE) return;
  let raf = 0, t0 = 0, idx = 0; const orig = img.src;
  const frames = r.ph.slice(0, n).map(p => sm(r, p[0]));
  const step = now => {
    const p = (now - t0) / 1100;
    if (p >= 1) { idx = (idx + 1) % n; t0 = now; img.src = frames[idx]; bars.forEach((b, j) => b.style.transform = `scaleX(${j < idx ? 1 : 0})`); }
    bars[idx].style.transform = `scaleX(${clamp(p, 0, 1)})`;
    raf = requestAnimationFrame(step);
  };
  c.addEventListener('pointerenter', () => { frames.forEach(preload); c.classList.add('play'); idx = 0; img.src = frames[0]; t0 = performance.now(); raf = requestAnimationFrame(step); });
  c.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); c.classList.remove('play'); bars.forEach(b => b.style.transform = ''); img.src = orig; });
}
$('#feedMore').onclick = () => { F.all = true; renderFeed(); };

/* brut / retouché */
const BA = ['lf0008', 'ge0091', 'lf0157', 'ge0128', 'lf0031', 'ge0092', 'lf0092'];
let baI = 0;
function bindBA() {
  const ba = $('#ba');
  const set = i => { baI = (i + BA.length) % BA.length; $('#baB').src = BASE + 'b/' + BA[baI] + '-brut.webp'; $('#baA').src = BASE + 'b/' + BA[baI] + '-retouche.webp'; };
  set(baI);
  let drag = false;
  const mv = x => { const r = ba.getBoundingClientRect(); ba.style.setProperty('--x', clamp((x - r.left) / r.width * 100, 2, 98) + '%'); };
  ba.addEventListener('pointerdown', e => { if (e.target.closest('#baN')) return; drag = true; ba.setPointerCapture(e.pointerId); mv(e.clientX); });
  ba.addEventListener('pointermove', e => { if (drag || e.pointerType === 'mouse') mv(e.clientX); });
  ba.addEventListener('pointerup', () => drag = false);
  $('#baN').onclick = e => { e.stopPropagation(); set(baI + 1); ba.style.setProperty('--x', '55%'); if (!RM) anim(ba, [{opacity: .3, filter: 'blur(6px)'}, {opacity: 1, filter: 'blur(0)'}], {duration: 600}); };
}

on(k => { F.all = false; moveInk(); renderFeed(); renderTiers(); estReset(); $('#fP').value = k !== 'all' ? TABS.find(t => t[0] === k)[1] : ''; });

/* ================= GRAPHISME ================= */
const fan = $('#fan');
{ const ROT = [-4, 2.5, -1.5, 3.5, -3, 1.5, -2.5, 3, -2, 2, -3.5, 1];
  const pref = ['soute', 'marelle', 'identites', 'campagnes', 'signaletique', 'ellipse', 'recrutement', 'atrium', 'festin', 'affiches', 'editions', 'budget'];
  const G = GRR.slice().sort((a, b) => pref.indexOf(a.id) - pref.indexOf(b.id));
  fan.innerHTML = G.map((r, i) => `<button class="gk" data-i="${i}" style="--rt:${ROT[i % ROT.length]}deg;--ty:${i % 2 ? 18 : 0}px"><span class="im"><img src="${sm(r, r.ph[0][0])}" alt="${esc(r.t)}" loading="lazy" draggable="false"></span><span class="ti">${esc(r.t)}<span>${r.ph.length}</span></span></button>`).join('');
  let down = false, moved = 0, sx = 0, sl = 0;
  fan.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = fan.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - sx; moved = Math.max(moved, Math.abs(d)); if (moved > 4) fan.classList.add('drag'); fan.scrollLeft = sl - d; });
  addEventListener('pointerup', () => { down = false; fan.classList.remove('drag'); });
  fan.addEventListener('click', e => { const b = e.target.closest('.gk'); if (!b || moved > 6) return; openSV(G, +b.dataset.i, 0); }, true);
}

/* ================= PLAN LARGE ================= */
const GENT = [
  [['Un concert, un spectacle', 250], ['Une cérémonie, une inauguration', 370], ['Un événement d\'entreprise', 370], ['Un mariage', 1290]],
  [['Une campagne d\'événement', 280], ['Une identité, une brochure', 550], ['Une campagne de communication', 830]],
  [['Une saison de concerts', 1190], ['Un photographe toute l\'année', 1390], ['Vos réseaux sociaux suivis', 240, 'mois']]
];
const TIMG = ['p/t/helena-3.webp', 'images/t/soute-1.webp', 'p/t/inaug-square-7.webp'];
function low(n) { let lo = Infinity, u = ''; n.calc[0].o.forEach(o => { if (o[1] != null && o[1] > 0 && o[1] < lo) { lo = o[1]; u = o[2] || ''; } }); return lo === Infinity ? null : [lo, u]; }
const unitS = u => u ? ' / ' + {mois: 'mois', an: 'an', saison: 'saison', semaine: 'semaine'}[u] : '';
function renderTiers() {
  const p = st.p !== 'all' ? P[st.p] : null;
  $('#tiers').innerHTML = PAL.map((x, i) => {
    let rows = p ? p.n.filter(n => n.pal === i).map(n => { const l = low(n); return [n.l, l ? `dès ${fmt(l[0])} €${unitS(l[1])}` : 'sur devis', l ? l[0] : Infinity, l ? l[1] : '']; }) : [];
    if (!rows.length) rows = GENT[i].map(g => [g[0], `dès ${fmt(g[1])} €${unitS(g[2])}`, g[1], g[2] || '']);
    const m = rows.reduce((a, r) => r[2] < a[2] ? r : a, rows[0]);
    return `<article class="tier" data-in><span class="ph"><img src="${BASE + TIMG[i]}" alt="" loading="lazy"></span>
      <span class="lv">${[0, 1, 2].map(j => `<s class="${j <= i ? 'on' : ''}"></s>`).join('')}</span>
      <h3>${x[0]}</h3><p class="ln se">${x[1]}</p>
      <ul>${rows.slice(0, 4).map(r => `<li>${esc(r[0])}<span>${r[1]}</span></li>`).join('')}</ul>
      <button class="odd" data-pal="${i}"><span><small>À partir de</small><b>${m[2] === Infinity ? 'Sur devis' : fmt(m[2]) + ' €' + unitS(m[3])}</b></span><span class="ic">${ico('a')}</span></button></article>`;
  }).join('');
  $$('#tiers .tier').forEach((t, i) => { t.style.transitionDelay = i * 90 + 'ms'; io.observe(t); });
  $$('#tiers .odd').forEach(b => b.onclick = () => openEst(+b.dataset.pal));
}

/* ================= ESTIMATION ================= */
const E = {p: null, n: 0, picks: []};
const qs = $('#qs');
function estReset() { E.p = st.p !== 'all' ? st.p : null; E.n = 0; initPicks(); }
function initPicks() { if (!E.p) return; E.picks = P[E.p].n[E.n].calc.map(g => g.m ? [] : [0]); }
function openEst(pal) {
  if (!E.p && st.p !== 'all') estReset();
  if (E.p && pal != null) { const j = P[E.p].n.findIndex(x => x.pal === pal); if (j >= 0) { E.n = j; initPicks(); } }
  renderEst(); openSheet('shE');
}
function renderEst() {
  let h = `<div class="q" style="border-top:0;padding-top:4px"><h4>Vous êtes</h4><div class="chs" data-q="p">${EST_ORDER.map(k => `<button data-v="${k}" class="${E.p === k ? 'on' : ''}">${P[k].t}</button>`).join('')}</div></div>`;
  if (E.p) {
    const n = P[E.p].n;
    h += `<div class="q"><h4>Vous cherchez</h4><div class="chs" data-q="n">${n.map((x, i) => `<button data-v="${i}" class="${E.n === i ? 'on' : ''}">${x.l}</button>`).join('')}</div></div>`;
    n[E.n].calc.forEach((g, gi) => { h += `<div class="q"><h4>${g.q}${g.m ? ', au choix' : ''}</h4><div class="chs" data-q="g" data-g="${gi}">${g.o.map((o, oi) => `<button data-v="${oi}" class="${(E.picks[gi] || []).includes(oi) ? 'on' : ''}">${o[0]}${g.m && o[1] ? `<em>+${fmt(o[1])} €</em>` : ''}</button>`).join('')}</div></div>`; });
  }
  qs.innerHTML = h; showRes();
}
qs.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const box = b.parentElement, q = box.dataset.q, v = b.dataset.v;
  if (q === 'p') { E.p = v; E.n = 0; initPicks(); renderEst(); return; }
  if (q === 'n') { E.n = +v; initPicks(); renderEst(); return; }
  const gi = +box.dataset.g, g = P[E.p].n[E.n].calc[gi], oi = +v;
  if (g.m) { const a = E.picks[gi] || []; E.picks[gi] = a.includes(oi) ? a.filter(x => x !== oi) : a.concat(oi); } else E.picks[gi] = [oi];
  $$('button', box).forEach(x => x.classList.toggle('on', (E.picks[gi] || []).includes(+x.dataset.v)));
  showRes();
});
let shown = 0;
function countTo(el, from, to) {
  const f = v => `${fmt(v)} à ${fmt(up50(v * 1.2))} €`;
  if (RM || !from) { el.textContent = f(to); return; }
  const t0 = performance.now();
  (function tk(now) { const t = clamp((now - t0) / 650, 0, 1), v = Math.round(lerp(from, to, 1 - Math.pow(1 - t, 4)) / 10) * 10; el.textContent = f(t < 1 ? v : to); if (t < 1) requestAnimationFrame(tk); })(t0);
}
const curEst = () => E.p ? estimate(P[E.p].n[E.n].calc, E.picks) : null;
function showRes() {
  const rN = $('#rN'), e = curEst();
  if (!e) { $('#rK').textContent = 'Votre projet'; rN.textContent = '…'; $('#rU').textContent = 'Choisissez votre profil'; shown = 0; return; }
  $('#rK').textContent = P[E.p].n[E.n].l;
  if (!e.lo) { rN.textContent = 'Sur devis'; shown = 0; } else { countTo(rN, shown, e.lo); shown = e.lo; }
  $('#rU').textContent = e.lo ? (e.unit ? UNIT[e.unit] : 'Fourchette indicative') + (e.devis ? ', plus une partie sur devis' : '') : 'Un échange suffit pour chiffrer';
}
$('#estB').onclick = () => openEst();
$('#toMsg').onclick = () => {
  const e = curEst();
  if (e) $('#fM').value = `Bonjour,\n\nNous cherchons ${P[E.p].n[E.n].ph}.\n${e.labels.join('\n')}\nEstimation affichée : ${rangeText(e)}.\n\n`;
  openSheet('shM');
};

/* ================= FEUILLES ================= */
const veil = $('#veil'); let sheetOpen = null;
function openSheet(id) { closeSheets(true); const s = $('#' + id); s.classList.add('on'); veil.classList.add('on'); sheetOpen = s; document.documentElement.style.overflow = 'hidden'; $('#dock').classList.add('off'); }
function closeSheets(keep) { $$('.sheet.on').forEach(s => { s.classList.remove('on'); s.style.transform = ''; }); sheetOpen = null; if (keep !== true) { veil.classList.remove('on'); document.documentElement.style.overflow = ''; $('#dock').classList.toggle('off', scrollY < innerHeight * .45); } }
veil.onclick = () => closeSheets();
$$('[data-close]').forEach(b => b.onclick = () => closeSheets());
$$('.sheet .gr').forEach(g => {
  let y0 = 0, dy = 0, s = g.parentElement;
  g.addEventListener('pointerdown', e => { y0 = e.clientY; dy = 0; g.setPointerCapture(e.pointerId); s.style.transition = 'none'; });
  g.addEventListener('pointermove', e => { if (!y0) return; dy = Math.max(0, e.clientY - y0); s.style.transform = `translate(-50%,${dy}px)`; });
  g.addEventListener('pointerup', () => { s.style.transition = ''; y0 = 0; if (dy > 110) closeSheets(); else s.style.transform = ''; });
});
$('#openMsg').onclick = () => openSheet('shM');
$('#mlB').onclick = () => openSheet('shL');

/* formulaire */
$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, ok = $('#fOk'), b = $('#sendB');
  if (!f.name.value.trim() || !/\S+@\S+\.\S+/.test(f.email.value) || !f.message.value.trim()) { ok.textContent = 'Merci de renseigner votre nom, votre e-mail et votre projet.'; return; }
  b.textContent = 'Envoi…';
  try {
    const d = Object.fromEntries(new FormData(f)); d._subject = 'Nouveau message depuis studioes.fr'; d._template = 'table';
    const r = await fetch('https://formsubmit.co/ajax/contact@studioes.fr', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(d)});
    if (!r.ok) throw 0;
    f.reset(); ok.textContent = 'Message envoyé. Réponse sous 48 h.'; b.textContent = 'Envoyé';
  } catch (err) { ok.textContent = 'L\'envoi n\'a pas abouti. Écrivez directement à contact@studioes.fr.'; b.textContent = 'Envoyer'; }
});

/* ================= CALENDRIER ================= */
{ const today = new Date(); today.setHours(0, 0, 0, 0);
  const C = {y: today.getFullYear(), m: today.getMonth(), sel: null};
  const MO = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const JO = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  $('#calBg').src = BASE + 'p/t/pub-petites-folies-17.webp';
  function draw() {
    const first = new Date(C.y, C.m, 1), off = (first.getDay() + 6) % 7, nd = new Date(C.y, C.m + 1, 0).getDate();
    $('#moT').textContent = MO[C.m].replace(/^./, c => c.toUpperCase()) + ' ' + C.y;
    $('#moP').disabled = C.y === today.getFullYear() && C.m === today.getMonth();
    $('#moN').disabled = (C.y - today.getFullYear()) * 12 + C.m - today.getMonth() >= 2;
    let h = '<span></span>'.repeat(off);
    for (let d = 1; d <= nd; d++) {
      const dt = new Date(C.y, C.m, d), wd = dt.getDay(), dis = dt <= today || wd === 0 || wd === 6;
      h += `<button data-d="${iso(dt)}" ${dis ? 'disabled' : ''} class="${+dt === +today ? 'td' : ''}${C.sel === iso(dt) ? ' on' : ''}">${d}</button>`;
    }
    $('#days').innerHTML = h;
  }
  $('#days').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    C.sel = b.dataset.d; const d = new Date(C.sel + 'T12:00');
    $$('#days button').forEach(x => x.classList.toggle('on', x === b));
    $('#calTx').innerHTML = `Jour choisi<b>${JO[d.getDay()].replace(/^./, c => c.toUpperCase())} ${d.getDate()} ${MO[d.getMonth()]}</b>`;
    $('#calGo').href = `https://cal.eu/studioes/30min?month=${C.sel.slice(0, 7)}&date=${C.sel}`;
  });
  $('#moP').onclick = () => { C.m--; if (C.m < 0) { C.m = 11; C.y--; } draw(); };
  $('#moN').onclick = () => { C.m++; if (C.m > 11) { C.m = 0; C.y++; } draw(); };
  draw();
}

/* ================= STORIES PLEIN ÉCRAN ================= */
const sv = $('#sv'), svI = $('#svI');
const S = {list: [], ri: 0, pi: 0, t0: 0, el: 0, paused: false, raf: 0, open: false, busy: false, DUR: 4600};
function openSV(list, ri, pi = 0) {
  S.list = list; S.open = true; sv.classList.add('on'); document.documentElement.style.overflow = 'hidden'; $('#dock').classList.add('off');
  loadRep(ri, pi, true);
  cancelAnimationFrame(S.raf); S.raf = requestAnimationFrame(svTick);
}
function closeSV() { if (!S.open) return; S.open = false; sv.classList.remove('on'); cancelAnimationFrame(S.raf); if (!sheetOpen) { document.documentElement.style.overflow = ''; $('#dock').classList.toggle('off', scrollY < innerHeight * .45); } renderStoriesSeen(); }
function renderStoriesSeen() { $$('.sto', stories).forEach(b => { const r = ORD[+b.dataset.i]; b.classList.toggle('seen', seen.has(r.id)); }); }
function loadRep(ri, pi, first) {
  S.ri = ri; const r = S.list[ri];
  seen.add(r.id); store.set('ses3-seen', [...seen].join(','));
  $('#svT').textContent = r.t; $('#svK').textContent = CAT(r) + ' · ' + r.ph.length + (r.k === 'g' ? ' visuels' : ' photos');
  $('#svAv').src = sm(r, r.ph[0][0]);
  $('#svBars').innerHTML = r.ph.map(() => '<s><i></i></s>').join('');
  $('#svPR').style.visibility = ri > 0 ? '' : 'hidden'; $('#svNR').style.visibility = ri < S.list.length - 1 ? '' : 'hidden';
  if (!first && !RM) anim($('#svC'), [{transform: 'scale(.94)', opacity: .4}, {transform: 'none', opacity: 1}], {duration: 600});
  showPh(pi, 0);
}
function showPh(pi, dir) {
  const r = S.list[S.ri]; S.pi = pi; const p = r.ph[pi], u = big(r, p[0]);
  $$('#svBars s').forEach((s, j) => { s.classList.toggle('dn', j < pi); $('i', s).style.transform = j < pi ? 'scaleX(1)' : 'scaleX(0)'; });
  $('#svCap').textContent = p[2] || '';
  S.el = 0; S.t0 = performance.now(); S.busy = true;
  const im = preload(u);
  const done = () => {
    svI.src = u; svI.classList.toggle('cv', p[1] < .9 && r.k !== 'g');
    $('#svFl').style.backgroundImage = `url(${sm(r, p[0])})`; $('#svAmb').style.backgroundImage = `url(${sm(r, p[0])})`;
    if (!RM && dir) { svI.style.filter = 'url(#mbS)'; mb('mbS', 70, 0, 600); anim(svI, [{opacity: .2, transform: `translateX(${dir * 6}%)`}, {opacity: 1, transform: 'none'}], {duration: 600}); setTimeout(() => svI.style.filter = '', 650); }
    S.busy = false; S.t0 = performance.now();
    if (r.ph[pi + 1]) preload(big(r, r.ph[pi + 1][0]));
  };
  im.complete ? done() : (im.onload = im.onerror = done);
}
function svNext() { const r = S.list[S.ri]; if (S.pi < r.ph.length - 1) showPh(S.pi + 1, 1); else if (S.ri < S.list.length - 1) loadRep(S.ri + 1, 0); else closeSV(); }
function svPrev() { if (S.pi > 0) showPh(S.pi - 1, -1); else if (S.ri > 0) loadRep(S.ri - 1, 0); else showPh(0, 0); }
function svTick(now) {
  if (!S.open) return;
  if (S.paused || S.busy) S.t0 = now - S.el;
  S.el = now - S.t0;
  const p = clamp(S.el / S.DUR, 0, 1), bar = $$('#svBars s i')[S.pi];
  if (bar) bar.style.transform = `scaleX(${p})`;
  if (p >= 1) svNext();
  S.raf = requestAnimationFrame(svTick);
}
{ let hold = 0, sx = 0, sy = 0, long = false;
  const c = $('#svC');
  c.addEventListener('pointerdown', e => { if (e.target.closest('.sv-hd,.sv-ft')) return; sx = e.clientX; sy = e.clientY; long = false; hold = setTimeout(() => { S.paused = true; long = true; }, 220); });
  c.addEventListener('pointerup', e => { clearTimeout(hold); S.paused = false; const dy = e.clientY - sy, dx = e.clientX - sx; if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { closeSV(); long = true; } else if (Math.abs(dx) > 60) { dx < 0 ? (S.ri < S.list.length - 1 ? loadRep(S.ri + 1, 0) : closeSV()) : S.ri > 0 && loadRep(S.ri - 1, 0); long = true; } });
  $('#svN').addEventListener('click', e => { if (!long) svNext(); });
  $('#svP').addEventListener('click', e => { if (!long) svPrev(); });
}
$('#svX').onclick = closeSV;
$('#svPR').onclick = () => S.ri > 0 && loadRep(S.ri - 1, 0);
$('#svNR').onclick = () => S.ri < S.list.length - 1 && loadRep(S.ri + 1, 0);
$('#svMsg').onclick = () => { const r = S.list[S.ri]; closeSV(); $('#fM').value = `Bonjour,\n\nNous avons vu le reportage « ${r.t} » et aimerions quelque chose de similaire.\n\n`; openSheet('shM'); };
$('#svEst').onclick = () => { closeSV(); openEst(S.list[S.ri].k === 'g' ? 1 : 0); };
addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeSV(); closeSheets(); }
  if (!S.open) return;
  if (e.key === 'ArrowRight') svNext();
  if (e.key === 'ArrowLeft') svPrev();
  if (e.key === ' ') { e.preventDefault(); S.paused = !S.paused; }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) S.paused = true; else S.paused = false; });

/* ================= DOCK ================= */
const dk = $('#dk'), links = $$('a', dk), secs = links.map(a => $('#' + a.dataset.s));
if (FINE && !RM) {
  dk.addEventListener('pointermove', e => links.forEach(a => { const r = a.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2)), s = 1 + .32 * Math.max(0, 1 - d / 120); a.style.transform = `translateY(${-(s - 1) * 22}px) scale(${s})`; }));
  dk.addEventListener('pointerleave', () => links.forEach(a => a.style.transform = ''));
  links.forEach(a => a.style.transition = 'color .3s,background .3s,transform .25s cubic-bezier(.16,1,.3,1)');
}

/* ================= APPARITIONS ================= */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -6% 0px'});
$$('[data-in],.mk,.stories').forEach(el => io.observe(el));
$$('.t2,.ct-t').forEach(h => $$('.mk', h).forEach((m, i) => m.firstElementChild.style.transitionDelay = i * .1 + 's'));

/* ================= DÉFILEMENT ================= */
const top = $('#top'); let lastY = scrollY, ticking = false;
function onScroll() {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY;
    top.classList.toggle('sc', y > 30);
    if (y > 320 && y > lastY + 3) top.classList.add('hide'); else if (y < lastY - 3 || y < 320) top.classList.remove('hide');
    document.body.classList.toggle('top-on', !top.classList.contains('hide'));
    lastY = y;
    if (!sheetOpen && !S.open) $('#dock').classList.toggle('off', y < innerHeight * .45);
    const mid = innerHeight * .4; let cur = 0;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= mid) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
    ticking = false;
  });
}
addEventListener('scroll', onScroll, {passive: true});
let lw = W();
addEventListener('resize', () => { moveInk(); if ((lw <= 700) !== (W() <= 700)) renderFeed(); lw = W(); });

/* ================= DÉPART ================= */
setP(st.p);
onScroll();
if (document.fonts) document.fonts.ready.then(moveInk);
})();
