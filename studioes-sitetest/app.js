/* Studio ES, refonte 2026 (v4). Code sans dépendance. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const BASE = 'https://studioes.fr/';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const store = {get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ico = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const preload = u => { const i = new Image(); i.decoding = 'async'; i.src = u; return i; };
const anim = (el, kf, o) => el.animate ? el.animate(kf, Object.assign({fill: 'forwards', easing: 'cubic-bezier(.16,1,.3,1)'}, o)) : null;
const IOE = 'cubic-bezier(.76,0,.24,1)';
const root = document.documentElement;

/* ---------- Données ---------- */
const FMAP = {}; REPS.forEach(r => r.ph.forEach(p => { FMAP[p[0]] = [r, p]; }));
const big = (r, f) => BASE + (r.old ? 'images/' : 'p/') + f + '.jpg';
const sm = (r, f) => BASE + (r.old ? 'images/t/' : 'p/t/') + f + '.webp';
const bigF = f => big(FMAP[f][0], f), smF = f => sm(FMAP[f][0], f);
const byId = id => REPS.find(r => r.id === id);
const PHR = REPS.filter(r => r.k !== 'g'), GRR = REPS.filter(r => r.k === 'g');
const isEnt = r => r.id.startsWith('fl-auto'), isCol = r => r.k === 'corp' && !isEnt(r);
const CAT = r => r.k === 'scene' ? 'Concert' : r.k === 'public' ? 'Festival' : r.k === 'g' ? 'Graphisme' : isEnt(r) ? 'Entreprise' : 'Collectivité';
P.autre = {t: 'Autre projet', n: [SITE, OUTIL, SUP, RS, COM()]};
const PROFS = [['culture', 'Lieu culturel, festival', 'Concerts, saisons, festivals'], ['collectivite', 'Collectivité', 'Commune, intercommunalité'], ['entreprise', 'Entreprise', 'Commerce, PME, lieu'], ['club', 'Club, association', 'Sport, culture, loisirs'], ['particulier', 'Particulier', 'Mariage, projet perso'], ['autre', 'Autre projet', 'Site, outil, application']];
const WHO = [['culture', 'Culture'], ['collectivite', 'Collectivité'], ['entreprise', 'Entreprise'], ['club', 'Club, asso'], ['particulier', 'Particulier']];
const HERO_OF = {culture: 'festival', collectivite: 'collectivite', entreprise: 'entreprise', club: 'club', particulier: 'mariage'};

/* ---------- État ---------- */
const st = {p: null, tab: 'all'};
{ const s = store.get('ses5'); if (s && P[s]) st.p = s; }
const seen = new Set((store.get('ses5-seen') || '').split(',').filter(Boolean));
let toastT = 0;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2200); }

/* ---------- Ancres ---------- */
function goTo(el) { if (!el) return; window.scrollTo({top: el.getBoundingClientRect().top + scrollY - (el.id === 'accueil' ? 0 : 20), behavior: RM ? 'auto' : 'smooth'}); }
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const t = $(a.getAttribute('href')); if (!t) return;
  e.preventDefault(); closeSheets(); closeSV(); closePF(); goTo(t);
});
$$('[data-open-pf]').forEach(b => b.addEventListener('click', () => openPF(b.id === 'feedMore' ? ({photo: 'photo', graph: 'graph'}[st.tab] || 'all') : 'all')));

/* ================= ACCUEIL ================= */
/* une photo par artiste ; transition : la nouvelle image monte comme un rideau, nette, l'ancienne s'éteint */
const HERO = ['la-fouine-5', 'mentissa-3', 'danakil-2', 'rimk-2', 'matmatah-3', 'genezio-2', 'bekar-3'];
const por = $('#por'), amb = $('#amb'), dots = $('#hDots');
const H = {i: 0, busy: false, t0: 0, el: 0, dur: 6000, cur: $('#pImg')};
dots.innerHTML = HERO.map(() => '<s><i></i></s>').join('');
function heroMeta() {
  const f = HERO[H.i], r = FMAP[f][0];
  $('#hT').textContent = r.t; $('#hK').textContent = CAT(r); $('#hTh').src = smF(f);
  $$('s', dots).forEach((s, j) => { s.classList.toggle('dn', j < H.i); $('i', s).style.transform = j < H.i ? 'scaleX(1)' : 'scaleX(0)'; });
}
function heroGo(i) {
  if (H.busy) return; H.busy = true;
  const u = bigF(HERO[i]), im = preload(u);
  const run = () => {
    H.i = i; heroMeta(); H.el = 0; H.t0 = performance.now();
    const old = H.cur, nx = document.createElement('img'); nx.className = 'nx'; nx.alt = ''; nx.src = u; por.appendChild(nx); H.cur = nx;
    if (RM) { old.remove(); nx.className = ''; H.busy = false; return; }
    anim(nx, [{clipPath: 'inset(100% 0 0 0)', transform: 'scale(1.12) translateY(4%)', filter: 'blur(10px)'}, {clipPath: 'inset(0% 0 0 0)', transform: 'scale(1) translateY(0)', filter: 'blur(0)'}], {duration: 1300, easing: IOE});
    anim(old, [{transform: 'scale(1)', filter: 'brightness(1)'}, {transform: 'scale(.94)', filter: 'brightness(.35)'}], {duration: 1300, easing: IOE});
    amb.style.opacity = .15; setTimeout(() => { amb.style.backgroundImage = `url(${smF(HERO[i])})`; amb.style.opacity = ''; }, 500);
    setTimeout(() => { old.remove(); nx.getAnimations().forEach(a => a.commitStyles && a.commitStyles()); nx.className = ''; H.busy = false; }, 1350);
    preload(bigF(HERO[(i + 1) % HERO.length]));
  };
  im.complete ? run() : (im.onload = run, im.onerror = () => { H.busy = false; });
}
let heroVis = true;
new IntersectionObserver(es => { heroVis = es[0].isIntersecting; }).observe($('#accueil'));
(function loop(now) {
  if (!H.t0) H.t0 = now;
  if (H.busy || !heroVis || document.hidden) H.t0 = now - H.el;
  H.el = now - H.t0;
  const p = clamp(H.el / H.dur, 0, 1), bar = $$('s i', dots)[H.i];
  if (bar) bar.style.transform = `scaleX(${p})`;
  if (p >= 1 && !H.busy) heroGo((H.i + 1) % HERO.length);
  requestAnimationFrame(loop);
})(performance.now());
H.cur.src = bigF(HERO[0]); amb.style.backgroundImage = `url(${smF(HERO[0])})`; heroMeta(); preload(bigF(HERO[1]));
const startUp = () => {
  if (document.body.classList.contains('go')) return; document.body.classList.add('go');
  if (!RM) anim(H.cur, [{clipPath: 'inset(100% 0 0 0)', transform: 'scale(1.12)', filter: 'blur(12px)'}, {clipPath: 'inset(0% 0 0 0)', transform: 'scale(1)', filter: 'blur(0)'}], {duration: 1500, easing: IOE});
};
H.cur.complete ? requestAnimationFrame(startUp) : (H.cur.onload = startUp, setTimeout(startUp, 2200));
$('#hCard').onclick = () => { const r = FMAP[HERO[H.i]][0]; openSV(PHR, PHR.indexOf(r), r.ph.findIndex(p => p[0] === HERO[H.i])); };

/* ================= LE TRAVAIL : stories + onglets métiers + bento ================= */
function order() {
  const lists = [PHR.filter(r => r.k === 'scene'), PHR.filter(r => r.k === 'public'), PHR.filter(r => r.k === 'corp')], out = [], used = new Set();
  for (let i = 0; i < 40; i++) lists.forEach(l => { const r = l[i]; if (r && !used.has(r.id)) { used.add(r.id); out.push(r); } });
  return out;
}
const ORD = order();
const GPREF = ['soute', 'identites', 'marelle', 'campagnes', 'signaletique', 'ellipse', 'recrutement', 'affiches', 'atrium', 'festin', 'editions', 'budget'];
const GORD = GRR.slice().sort((a, b) => GPREF.indexOf(a.id) - GPREF.indexOf(b.id));
const stories = $('#stories');
stories.innerHTML = ORD.map((r, i) => `<button class="sto${seen.has(r.id) ? ' seen' : ''}" data-i="${i}" style="transition-delay:${Math.min(i, 12) * 35}ms"><span class="ring"><span><img src="${sm(r, r.ph[0][0])}" alt="" loading="lazy"></span></span><b>${esc(r.t)}</b></button>`).join('');
stories.addEventListener('click', e => { const b = e.target.closest('.sto'); if (b) openSV(ORD, +b.dataset.i, 0); });

const SZ = {L: [6, 4, 6, 2, 2], M: [3, 2, 3, 1, 1], W: [6, 2, 6, 2, 1]};
const sz = s => { const z = SZ[s]; return `--cw:${z[0]};--ch:${z[1]};--tw:${z[2]};--mw:${z[3]};--mh:${z[4]}`; };
function cardRep(r, s, list) {
  const f = r.ph.find(p => s === 'W' ? p[1] > 1.2 : p[1] < 1.2) || r.ph[0];
  return `<button class="c ph" data-r="${r.id}" data-l="${list}" data-sz="${s}" style="${sz(s)}"><img class="bgi" src="${sm(r, f[0])}" alt="" loading="lazy" decoding="async"><span class="bars">${r.ph.slice(0, 5).map(() => '<s><i></i></s>').join('')}</span><span class="chip glass"><i></i>${CAT(r)}</span><span class="chip glass cnt">${r.ph.length}${r.k === 'g' ? ' visuels' : ' photos'}</span><span class="bot"><h3>${esc(r.t)}</h3><span class="ic">${ico('ne')}</span></span></button>`;
}
const STAT = () => `<div class="c k-stat" style="${sz('M')}"><b>${PHR.length}</b><p>reportages en ligne<br><span class="se">retouchés image par image.</span></p></div>`;
const DC = () => `<a class="c k-dc" href="https://declic.studioes.fr" target="_blank" rel="noopener" style="--cw:6;--ch:2;--tw:6;--mw:2;--mh:1"><span class="tx"><b>Trois scènes, un seul déclic.</b><span>Un mini-jeu pour se mettre dans la peau du photographe.</span></span><img src="${BASE}a/declic.webp" alt="" loading="lazy"></a>`;
const TX = (ic, t, p) => `<div class="c k-tx" style="${sz('M')}">${ico(ic).replace('<svg', '<svg class="big"')}<span><h3>${t}</h3><p>${p}</p></span></div>`;
const feed = $('#feed');
function renderFeed() {
  const P1 = ORD, G = GORD; let h = '';
  if (st.tab === 'all') { const ph = ['la-fouine', 'pub-petites-folies', 'inauguration', 'philippe-katerine', 'pub-eucalyptus'].map(byId); h = cardRep(ph[0], 'L', 'p') + cardRep(ph[1], 'M', 'p') + STAT() + cardRep(G[0], 'M', 'g') + cardRep(ph[2], 'M', 'p') + DC() + cardRep(G[1], 'M', 'g') + cardRep(ph[3], 'M', 'p'); }
  if (st.tab === 'photo') h = ['L', 'M', 'M', 'M', 'M', 'W', 'M', 'M'].map((s, i) => cardRep(P1[i], s, 'p')).join('');
  if (st.tab === 'graph') h = ['L', 'M', 'M', 'M', 'M', 'W', 'M', 'M'].map((s, i) => cardRep(G[i], s, 'g')).join('');
  if (st.tab === 'web') h = `<a class="c ph k-site" href="#rdv" data-cfg="autre" style="${sz('L')}"><img class="bgi" src="${BASE}s/site.webp" alt="" loading="lazy"><span class="chip glass"><i></i>Site internet</span><span class="bot"><h3>Sites sur mesure</h3><span class="ic">${ico('ne')}</span></span></a>` + DC() + TX('i-app', 'Outils et applications', 'Espaces de travail, configurateurs, automatisations.') + TX('i-star', 'Projets sur mesure', 'Un jeu, une application, une idée à construire.');
  feed.innerHTML = h;
  $$('.c', feed).forEach((c, i) => { c.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(c); });
  $$('.c[data-r]', feed).forEach(bindCard);
  const s = $('.k-site', feed); if (s) s.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openCfg({p: 'autre'}); }, true);
  $('#feedMore').style.display = st.tab === 'web' ? 'none' : '';
}
function bindCard(c) {
  const r = byId(c.dataset.r), list = c.dataset.l === 'g' ? GORD : ORD, img = $('.bgi', c), bars = $$('.bars s i', c), n = bars.length;
  c.onclick = () => openSV(list, list.indexOf(r), 0);
  if (!FINE) return;
  let raf = 0, t0 = 0, idx = 0; const orig = img.src, frames = r.ph.slice(0, n).map(p => sm(r, p[0]));
  const step = now => { const p = (now - t0) / 1100; if (p >= 1) { idx = (idx + 1) % n; t0 = now; img.src = frames[idx]; bars.forEach((b, j) => b.style.transform = `scaleX(${j < idx ? 1 : 0})`); } bars[idx].style.transform = `scaleX(${clamp(p, 0, 1)})`; raf = requestAnimationFrame(step); };
  c.addEventListener('pointerenter', () => { frames.forEach(preload); c.classList.add('play'); idx = 0; t0 = performance.now(); raf = requestAnimationFrame(step); });
  c.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); c.classList.remove('play'); bars.forEach(b => b.style.transform = ''); img.src = orig; });
}
const tabs = $('#tabs'), ink = $('#ink');
function moveInk() { const b = $(`button[data-k="${st.tab}"]`, tabs); if (!b) return; ink.style.width = b.offsetWidth + 'px'; ink.style.transform = `translateX(${b.offsetLeft - 5}px)`; ink.style.left = '5px'; $$('button', tabs).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); }
tabs.addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b || b.dataset.k === st.tab) return; st.tab = b.dataset.k; moveInk(); renderFeed(); });

/* ================= PORTFOLIO PLEIN ÉCRAN ================= */
const SEAS = ['soute', 'ellipse', 'marelle', 'atrium'], CAMP = ['campagnes', 'recrutement', 'budget', 'festin', 'affiches'];
const CH = [
  ['all', 'Tout', () => true], ['photo', 'Photographie', r => r.k !== 'g'], ['scene', 'Concerts', r => r.k === 'scene'], ['public', 'Festivals', r => r.k === 'public'],
  ['col', 'Collectivités', isCol], ['ent', 'Entreprises', isEnt], ['graph', 'Graphisme', r => r.k === 'g'], ['seas', 'Saisons culturelles', r => SEAS.includes(r.id)],
  ['id', 'Identités', r => r.id === 'identites'], ['camp', 'Campagnes', r => CAMP.includes(r.id)], ['sig', 'Signalétique', r => r.id === 'signaletique'], ['ed', 'Éditions', r => r.id === 'editions']
];
const pf = $('#pf'), pfG = $('#pfG'), pfQ = $('#pfQ'), pfC = $('#pfC');
const PF = {c: 'all', q: '', list: []};
pfC.innerHTML = CH.map(([k, l, f]) => `<button data-c="${k}">${l}<em>${REPS.filter(f).length}</em></button>`).join('');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function pfRender() {
  const f = CH.find(c => c[0] === PF.c)[2], q = norm(PF.q.trim());
  PF.list = REPS.filter(r => f(r) && (!q || norm(r.t + ' ' + CAT(r) + ' ' + r.ph.map(p => p[2] || '').join(' ')).includes(q)));
  $$('button', pfC).forEach(b => b.classList.toggle('on', b.dataset.c === PF.c));
  $('#pfN').textContent = PF.list.length;
  pfG.innerHTML = PF.list.length ? PF.list.map((r, i) => { const p = r.ph[0]; return `<button class="pc" data-i="${i}" style="animation-delay:${Math.min(i, 16) * 35}ms"><img src="${sm(r, p[0])}" alt="" loading="lazy" style="aspect-ratio:${p[1]}"><span class="chip glass"><i></i>${CAT(r)}</span><span class="ti"><b>${esc(r.t)}</b><span>${r.ph.length}</span></span></button>`; }).join('') : '<p class="pf-empty">Aucun résultat. Essayez un autre mot.</p>';
}
pfC.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; PF.c = b.dataset.c; pfRender(); b.scrollIntoView({inline: 'nearest', block: 'nearest', behavior: 'smooth'}); });
pfQ.addEventListener('input', () => { PF.q = pfQ.value; pfRender(); });
pfG.addEventListener('click', e => { const b = e.target.closest('.pc'); if (b) openSV(PF.list, +b.dataset.i, 0); });
function openPF(c) { PF.c = c || 'all'; pfRender(); pf.classList.add('on'); pf.scrollTop = 0; root.style.overflow = 'hidden'; dockOff(true); history.replaceState(null, '', '#portfolio'); }
function closePF() { if (!pf.classList.contains('on')) return; pf.classList.remove('on'); root.style.overflow = ''; dockOff(false); history.replaceState(null, '', location.pathname); }
$('#pfX').onclick = closePF;

/* ================= PLAN LARGE : du plan serré au plan large ================= */
const INC = [
  ['Le reportage, sur place', 'Une sélection resserrée, retouchée image par image', 'En option : livraison le jour même'],
  ['Les supports tirés du reportage : affiches, brochures, visuels réseaux', 'Une direction artistique commune'],
  ['Un suivi sur la saison ou sur l\'année', 'Un seul interlocuteur pour la photo et la communication']
];
const ZT = ['Plan serré : une date, un reportage', 'Plan moyen : le reportage et ses supports', 'Plan large : toute une saison'];
const GEN = [[250, ''], [280, ''], [240, 'mois']];
const pl = $('#pl'), rng = $('#rng');
const PL = {z: 0, t: 0, touched: false};
function low(n) { let lo = Infinity, u = ''; n.calc[0].o.forEach(o => { if (o[1] != null && o[1] > 0 && o[1] < lo) { lo = o[1]; u = o[2] || ''; } }); return lo === Infinity ? null : [lo, u]; }
const unitS = u => u ? ' / ' + ({mois: 'mois', an: 'an', saison: 'saison', semaine: 'semaine'}[u]) : '';
function plPrice(i) { const p = st.p ? P[st.p] : null; if (p) { const xs = p.n.filter(n => n.pal === i).map(low).filter(Boolean); if (xs.length) return xs.reduce((a, b) => b[0] < a[0] ? b : a); } return GEN[i]; }
$('#who').innerHTML = WHO.map(([k, l]) => `<button data-k="${k}">${l}</button>`).join('');
function plText(animIn) {
  const i = PL.t;
  $('#plH').textContent = PAL[i][0]; $('#plL').textContent = PAL[i][1];
  const items = []; for (let j = 0; j <= i; j++) INC[j].forEach(t => items.push([t, j === i && i > 0]));
  $('#inc').innerHTML = items.map(([t, nw], k) => `<li class="${nw ? 'nw' : ''}${nw && animIn ? ' add' : ''}" style="transition-delay:${k * 40}ms">${ico('ok')}<span>${esc(t)}</span></li>`).join('');
  if (animIn) requestAnimationFrame(() => requestAnimationFrame(() => $$('#inc li.add').forEach(li => li.classList.remove('add'))));
  const pr = plPrice(i); $('#plP').textContent = `${fmt(pr[0])} €${unitS(pr[1])}`;
  $('#plFk').textContent = st.p ? 'À partir de, pour vous' : 'À partir de';
  $$('#zmL button').forEach((b, j) => b.classList.toggle('on', j === i));
  $('#zmT').textContent = ZT[i]; rng.setAttribute('aria-valuenow', i);
}
function plZ(z) {
  PL.z = clamp(z, 0, 1); pl.style.setProperty('--z', PL.z.toFixed(4));
  $('#mm').textContent = Math.round(85 - 61 * PL.z) + ' mm';
  const t = Math.round(PL.z * 2); if (t !== PL.t) { PL.t = t; plText(true); }
}
function plSnap(t) { pl.classList.add('snap'); plZ(t / 2); }
function plImg() { $('#plImg').src = BASE + 'h/' + (st.p ? HERO_OF[st.p] : 'festival') + '-1600.webp'; $$('#who button').forEach(b => b.classList.toggle('on', b.dataset.k === st.p)); plText(false); }
{ let drag = false;
  const at = x => { const r = rng.getBoundingClientRect(); return clamp((x - r.left) / r.width, 0, 1); };
  rng.addEventListener('pointerdown', e => { drag = true; PL.touched = true; pl.classList.remove('snap'); rng.setPointerCapture(e.pointerId); plZ(at(e.clientX)); });
  rng.addEventListener('pointermove', e => { if (drag) plZ(at(e.clientX)); });
  const up = () => { if (!drag) return; drag = false; plSnap(Math.round(PL.z * 2)); };
  rng.addEventListener('pointerup', up); rng.addEventListener('pointercancel', up);
  rng.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { PL.touched = true; plSnap(Math.min(2, PL.t + 1)); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { PL.touched = true; plSnap(Math.max(0, PL.t - 1)); e.preventDefault(); } });
  $('#zmL').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { PL.touched = true; plSnap(+b.dataset.i); } });
}
$('#who').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; st.p = st.p === b.dataset.k ? null : b.dataset.k; store.set('ses5', st.p); plImg(); });
$('#plGo').onclick = () => openCfg({p: st.p, pal: PL.t});
/* petite démonstration du curseur la première fois qu'on arrive sur le bloc */
new IntersectionObserver((es, o) => { if (!es[0].isIntersecting || RM) return; o.disconnect(); setTimeout(() => { if (PL.touched) return; plSnap(1); setTimeout(() => { if (!PL.touched) plSnap(0); }, 1700); }, 900); }, {threshold: .5}).observe(pl);
plImg(); plZ(0); plText(false);

/* ================= CONFIGURATEUR (panier) ================= */
const CF = {step: 0, p: null, n: null, picks: [], basket: []};
try { CF.basket = JSON.parse(store.get('ses5-cart') || '[]'); } catch (e) { CF.basket = []; }
const cfg = $('#cfg');
const STEPS = ['Profil', 'Besoin', 'Formule', 'Récapitulatif'];
const saveCart = () => { store.set('ses5-cart', JSON.stringify(CF.basket)); const n = CF.basket.length; $('#estN').textContent = n; $('#estB').classList.toggle('has', n > 0); };
function openCfg(o = {}) {
  if (o.p) { CF.p = o.p; CF.step = 1; CF.n = null; if (o.pal != null) { const j = P[CF.p].n.findIndex(x => x.pal === o.pal); if (j >= 0) { CF.n = j; initPicks(); CF.step = 2; } } }
  else CF.step = CF.basket.length && o.pal == null ? 3 : 0;
  cfgRender(); openSheet('shE');
}
function initPicks() { CF.picks = P[CF.p].n[CF.n].calc.map(g => g.m ? [] : [0]); }
function lineEst() { return CF.p != null && CF.n != null ? estimate(P[CF.p].n[CF.n].calc, CF.picks) : null; }
function cfgRender() {
  const s = CF.step;
  $('#prog').innerHTML = STEPS.map((t, i) => `<button data-s="${i}" class="${i < s ? 'dn' : i === s ? 'on' : ''}" ${i > s || (i === 3 && !CF.basket.length) ? 'disabled' : ''}><i></i>${t}</button>`).join('');
  let h = '';
  if (s === 0) h = `<div class="stp"><h3 class="d">Vous êtes</h3><div class="opts">${PROFS.map(([k, t, d]) => `<button class="op${CF.p === k ? ' on' : ''}" data-p="${k}">${t}<small>${d}</small></button>`).join('')}</div></div>`;
  if (s === 1) h = `<div class="stp"><h3 class="d">Vous cherchez</h3><div class="opts">${P[CF.p].n.map((x, i) => { const l = low(x); return `<button class="op${CF.n === i ? ' on' : ''}" data-n="${i}">${x.l}<small>${l ? 'dès ' + fmt(l[0]) + ' €' + unitS(l[1]) : 'sur devis'}</small></button>`; }).join('')}</div></div>`;
  if (s === 2) { const n = P[CF.p].n[CF.n]; h = `<div class="stp"><h3 class="d">${n.l}</h3>${n.calc.map((g, gi) => `<div class="grp"><h4>${g.q}${g.m ? ', au choix' : ''}</h4><div class="chs" data-g="${gi}">${g.o.map((o, oi) => `<button data-o="${oi}" class="${(CF.picks[gi] || []).includes(oi) ? 'on' : ''}">${o[0]}<em>${o[1] == null ? 'sur devis' : o[1] === 0 ? '' : (g.m ? '+' : '') + fmt(o[1]) + ' €' + unitS(o[2] || '')}</em></button>`).join('')}</div></div>`).join('')}</div>`; }
  if (s === 3) {
    const pub = CF.basket.some(b => b.p === 'collectivite');
    h = `<div class="stp"><h3 class="d">Votre sélection</h3><ul class="bask">${CF.basket.map((b, i) => `<li><span><b>${esc(b.l)}</b><small>${esc(b.labels.join(' · ') || 'Sur devis')}</small></span><span class="pr">${b.lo ? fmt(b.lo) + ' à ' + fmt(b.hi) + ' €' + unitS(b.unit) : 'Sur devis'}<button class="rm" data-rm="${i}">Retirer</button></span></li>`).join('')}</ul>
      <button class="addb" id="addMore">+ Ajouter un autre besoin</button>
      <p class="note">${pub ? 'Pour une collectivité : paiement après la prestation, sur facture. Le devis peut servir de base au bon de commande.' : 'À la commande : un acompte de 30 % sur la partie ponctuelle. Les formules mensuelles démarrent à une date fixée ensemble.'}</p>
      <form id="cfgForm" style="margin-top:18px" novalidate>
        <div class="two"><label class="fld"><span>Date souhaitée</span><input name="date" type="date"></label><label class="fld"><span>Lieu</span><input name="lieu" placeholder="Ville, salle…"></label></div>
        <div class="two"><label class="fld"><span>Nom, structure</span><input name="name" autocomplete="name" required></label><label class="fld"><span>E-mail</span><input name="email" type="email" autocomplete="email" required></label></div>
        <label class="fld"><span>Téléphone</span><input name="phone" type="tel" autocomplete="tel"></label>
        <label class="fld"><span>Précisions</span><textarea name="message" placeholder="Ce qui compte pour vous"></textarea></label>
        <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
        <p class="fok" id="cfgOk" aria-live="polite"></p>
      </form></div>`;
  }
  cfg.innerHTML = h; cfg.scrollTop = 0; cfgFoot();
}
function totals() { let lo = 0, devis = false; const rec = {}; CF.basket.forEach(b => { if (b.devis) devis = true; if (b.unit) rec[b.unit] = (rec[b.unit] || 0) + b.lo; else lo += b.lo; }); return {lo, hi: up50(lo * 1.2), rec, devis}; }
let shown = 0;
const rangeF = v => `${fmt(v)} à ${fmt(up50(v * 1.2))} €`;
function countTo(el, to) { const from = shown; shown = to; if (RM || !from || from === to) { el.textContent = rangeF(to); return; } const t0 = performance.now(); (function tk(now) { const t = clamp((now - t0) / 600, 0, 1), v = Math.round(lerp(from, to, 1 - Math.pow(1 - t, 4)) / 10) * 10; el.textContent = rangeF(t < 1 ? v : to); if (t < 1) requestAnimationFrame(tk); })(t0); }
function cfgFoot() {
  const s = CF.step, tN = $('#tN'), tK = $('#tK'), tR = $('#tR'), act = $('#cfgAct'), back = `<button class="bt bt-g" data-back>Retour</button>`;
  tR.innerHTML = '';
  if (s < 2) { tK.textContent = CF.basket.length ? 'Votre sélection' : 'Estimation'; const t = totals(); if (CF.basket.length && t.lo) countTo(tN, t.lo); else { tN.textContent = s === 0 ? 'Choisissez' : P[CF.p].t; shown = 0; } act.innerHTML = s === 0 ? (CF.basket.length ? `<button class="bt bt-w" data-goto="3">Voir ma sélection (${CF.basket.length})</button>` : `<a class="bt bt-g" href="https://cal.eu/studioes/30min" target="_blank" rel="noopener">Plutôt en parler de vive voix</a>`) : back; return; }
  if (s === 2) { const e = lineEst(); tK.textContent = e.unit ? 'Estimation, ' + UNIT[e.unit] : 'Estimation'; if (e.lo) countTo(tN, e.lo); else { tN.textContent = 'Sur devis'; shown = 0; } if (e.devis && e.lo) tR.innerHTML = '<small>plus une partie</small><b>sur devis</b>'; act.innerHTML = back + `<button class="bt bt-a" data-add>Ajouter au devis${ico('a')}</button>`; return; }
  const t = totals(), recs = Object.entries(t.rec);
  if (t.lo) { tK.textContent = 'Total ponctuel'; countTo(tN, t.lo); tR.innerHTML = recs.map(([u, v]) => `<small>puis ${UNIT[u]}</small><b>${rangeF(v)}</b>`).join(''); }
  else if (recs.length) { const [u, v] = recs[0]; tK.textContent = 'Total, ' + UNIT[u]; countTo(tN, v); tR.innerHTML = recs.slice(1).map(([u2, v2]) => `<small>et ${UNIT[u2]}</small><b>${rangeF(v2)}</b>`).join(''); }
  else { tK.textContent = 'Total'; tN.textContent = 'Sur devis'; shown = 0; }
  act.innerHTML = `<a class="bt bt-g" href="https://cal.eu/studioes/30min" target="_blank" rel="noopener">Réserver un appel</a><button class="bt bt-a" data-send>Envoyer la demande</button>`;
}
$('#prog').addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.disabled) return; CF.step = +b.dataset.s; cfgRender(); });
cfg.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.p) { CF.p = b.dataset.p; CF.n = null; CF.step = 1; cfgRender(); return; }
  if (b.dataset.n != null) { CF.n = +b.dataset.n; initPicks(); CF.step = 2; cfgRender(); return; }
  if (b.dataset.o != null) { const gi = +b.parentElement.dataset.g, g = P[CF.p].n[CF.n].calc[gi], oi = +b.dataset.o; if (g.m) { const a = CF.picks[gi] || []; CF.picks[gi] = a.includes(oi) ? a.filter(x => x !== oi) : a.concat(oi); } else CF.picks[gi] = [oi]; $$('button', b.parentElement).forEach(x => x.classList.toggle('on', (CF.picks[gi] || []).includes(+x.dataset.o))); cfgFoot(); return; }
  if (b.dataset.rm != null) { CF.basket.splice(+b.dataset.rm, 1); saveCart(); if (!CF.basket.length) CF.step = 0; cfgRender(); return; }
  if (b.id === 'addMore') { CF.step = CF.p ? 1 : 0; cfgRender(); }
});
$('#cfgAct').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.hasAttribute('data-back')) { CF.step = Math.max(0, CF.step - 1); cfgRender(); }
  if (b.dataset.goto) { CF.step = 3; cfgRender(); }
  if (b.hasAttribute('data-add')) { const n = P[CF.p].n[CF.n], e2 = lineEst(); CF.basket.push({p: CF.p, l: n.l, labels: e2.labels, lo: e2.lo, hi: e2.hi, unit: e2.unit, devis: e2.devis}); saveCart(); CF.step = 3; cfgRender(); if (!RM) anim($('#estB'), [{transform: 'scale(1)'}, {transform: 'scale(1.18)'}, {transform: 'scale(1)'}], {duration: 600}); }
  if (b.hasAttribute('data-send')) sendCfg(b);
});
async function sendCfg(btn) {
  const f = $('#cfgForm'), ok = $('#cfgOk');
  if (!f.name.value.trim() || !/\S+@\S+\.\S+/.test(f.email.value)) { ok.textContent = 'Merci de renseigner votre nom et votre e-mail.'; f.name.focus(); return; }
  const t = totals(), d = Object.fromEntries(new FormData(f));
  d.selection = CF.basket.map(b => `• ${b.l} : ${b.labels.join(', ')} (${b.lo ? fmt(b.lo) + ' à ' + fmt(b.hi) + ' €' + (b.unit ? ' ' + UNIT[b.unit] : '') : 'sur devis'})`).join('\n');
  d.total = t.lo ? `${fmt(t.lo)} à ${fmt(t.hi)} €` : 'sur devis'; d.profil = (PROFS.find(p => p[0] === CF.basket[0].p) || [])[1] || '';
  d._subject = 'Demande de devis depuis studioes.fr'; d._template = 'table';
  btn.textContent = 'Envoi…';
  try { const r = await fetch('https://formsubmit.co/ajax/contact@studioes.fr', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(d)}); if (!r.ok) throw 0; CF.basket = []; saveCart(); closeSheets(); toast('Demande envoyée. Réponse sous 48 h.'); CF.step = 0; }
  catch (err) { ok.textContent = 'L\'envoi n\'a pas abouti. Écrivez à contact@studioes.fr.'; btn.textContent = 'Envoyer la demande'; }
}
$('#estB').onclick = () => openCfg({});
saveCart();

/* ================= FEUILLES ================= */
const veil = $('#veil'); let sheetOpen = null;
function openSheet(id) { $$('.sheet.on').forEach(s => s.classList.remove('on')); const s = $('#' + id); s.classList.add('on'); veil.classList.add('on'); sheetOpen = s; root.style.overflow = 'hidden'; dockOff(true); }
function closeSheets() { if (!sheetOpen) return; $$('.sheet.on').forEach(s => { s.classList.remove('on'); s.style.transform = ''; }); sheetOpen = null; veil.classList.remove('on'); if (!pf.classList.contains('on')) { root.style.overflow = ''; dockOff(false); } }
veil.onclick = closeSheets;
$$('[data-close]').forEach(b => b.onclick = closeSheets);
$$('.sheet .gr').forEach(g => { let y0 = 0, dy = 0; const s = g.parentElement;
  g.addEventListener('pointerdown', e => { y0 = e.clientY; dy = 0; g.setPointerCapture(e.pointerId); s.style.transition = 'none'; });
  g.addEventListener('pointermove', e => { if (!y0) return; dy = Math.max(0, e.clientY - y0); s.style.transform = `translate(-50%,${dy}px)`; });
  g.addEventListener('pointerup', () => { s.style.transition = ''; y0 = 0; if (dy > 110) closeSheets(); else s.style.transform = ''; }); });
$('#openMsg').onclick = () => openSheet('shM');
$('#mlB').onclick = () => openSheet('shL');
$('#form').addEventListener('submit', async e => {
  e.preventDefault(); const f = e.target, ok = $('#fOk'), b = $('#sendB');
  if (!f.name.value.trim() || !/\S+@\S+\.\S+/.test(f.email.value) || !f.message.value.trim()) { ok.textContent = 'Merci de renseigner votre nom, votre e-mail et votre projet.'; return; }
  b.textContent = 'Envoi…';
  try { const d = Object.fromEntries(new FormData(f)); d._subject = 'Nouveau message depuis studioes.fr'; d._template = 'table'; const r = await fetch('https://formsubmit.co/ajax/contact@studioes.fr', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(d)}); if (!r.ok) throw 0; f.reset(); closeSheets(); toast('Message envoyé. Réponse sous 48 h.'); b.textContent = 'Envoyer'; }
  catch (err) { ok.textContent = 'L\'envoi n\'a pas abouti. Écrivez directement à contact@studioes.fr.'; b.textContent = 'Envoyer'; }
});

/* ================= RENDEZ-VOUS : agenda Cal.com intégré, calendrier maison en secours ================= */
const calBox = $('#calEmbed');
function calFallback() {
  if (calBox.dataset.fb) return; calBox.dataset.fb = 1;
  calBox.innerHTML = `<div class="cal-fb"><div class="mo"><b id="moT"></b><div><button class="ic" id="moP" aria-label="Mois précédent">${ico('al')}</button><button class="ic" id="moN" aria-label="Mois suivant">${ico('a')}</button></div></div><div class="wd" aria-hidden="true"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="days" id="days"></div><div class="cal-go"><p id="calTx">Choisissez un jour<b>&nbsp;</b></p><a class="bt bt-a bt-s" id="calGo" href="https://cal.eu/studioes/30min" target="_blank" rel="noopener">Voir les créneaux${ico('a')}</a></div></div>`;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const C = {y: today.getFullYear(), m: today.getMonth(), sel: null};
  const MO = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'], JO = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const p2 = n => String(n).padStart(2, '0'), iso = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`, cap = s => s[0].toUpperCase() + s.slice(1);
  function draw() {
    const first = new Date(C.y, C.m, 1), off = (first.getDay() + 6) % 7, nd = new Date(C.y, C.m + 1, 0).getDate();
    $('#moT').textContent = cap(MO[C.m]) + ' ' + C.y;
    $('#moP').disabled = C.y === today.getFullYear() && C.m === today.getMonth();
    $('#moN').disabled = (C.y - today.getFullYear()) * 12 + C.m - today.getMonth() >= 2;
    let h = '<span></span>'.repeat(off);
    for (let d = 1; d <= nd; d++) { const dt = new Date(C.y, C.m, d), wd = dt.getDay(); h += `<button data-d="${iso(dt)}" ${dt <= today || wd === 0 || wd === 6 ? 'disabled' : ''} class="${C.sel === iso(dt) ? 'on' : ''}">${d}</button>`; }
    $('#days').innerHTML = h;
  }
  $('#days').addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.disabled) return; C.sel = b.dataset.d; const d = new Date(C.sel + 'T12:00'); $$('#days button').forEach(x => x.classList.toggle('on', x === b)); $('#calTx').innerHTML = `Jour choisi<b>${cap(JO[d.getDay()])} ${d.getDate()} ${MO[d.getMonth()]}</b>`; $('#calGo').href = `https://cal.eu/studioes/30min?month=${C.sel.slice(0, 7)}&date=${C.sel}`; });
  $('#moP').onclick = () => { C.m--; if (C.m < 0) { C.m = 11; C.y--; } draw(); };
  $('#moN').onclick = () => { C.m++; if (C.m > 11) { C.m = 0; C.y++; } draw(); };
  draw();
}
function calLoad() {
  if (calBox.dataset.ld) return; calBox.dataset.ld = 1;
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; const s = d.createElement('script'); s.src = A; s.onerror = calFallback; d.head.appendChild(s); cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.eu/embed/embed.js', 'init');
  Cal('init', 'rdv', {origin: 'https://app.cal.eu'});
  Cal.ns.rdv('inline', {elementOrSelector: '#calEmbed', calLink: 'studioes/30min', config: {layout: 'month_view', theme: 'dark'}});
  Cal.ns.rdv('ui', {theme: 'dark', hideEventTypeDetails: true, layout: 'month_view', cssVarsPerTheme: {dark: {'cal-brand': '#3B5BFF', 'cal-brand-emphasis': '#5C78FF', 'cal-brand-text': '#ffffff', 'cal-bg': '#14141C', 'cal-bg-muted': '#1C1C27', 'cal-border': 'rgba(239,235,227,.12)', 'cal-text': '#EFEBE3'}}});
  setTimeout(() => { if (!$('iframe', calBox)) calFallback(); }, 7000);
}
new IntersectionObserver(es => { if (es[0].isIntersecting) calLoad(); }, {rootMargin: '600px'}).observe(calBox);

/* ================= STORIES PLEIN ÉCRAN ================= */
const sv = $('#sv');
const S = {list: [], ri: 0, pi: 0, t0: 0, el: 0, paused: false, open: false, busy: false, DUR: 4800};
function openSV(list, ri, pi = 0) { S.list = list; S.open = true; sv.classList.add('on'); root.style.overflow = 'hidden'; dockOff(true); loadRep(ri, pi, 0); requestAnimationFrame(svTick); }
function closeSV() {
  if (!S.open) return; S.open = false; sv.classList.remove('on');
  if (!pf.classList.contains('on') && !sheetOpen) { root.style.overflow = ''; dockOff(false); }
  $$('.sto', stories).forEach(b => b.classList.toggle('seen', seen.has(ORD[+b.dataset.i].id)));
  if (location.hash.startsWith('#r=')) history.replaceState(null, '', location.pathname);
}
function layer(r, p) { const d = document.createElement('div'); d.className = 'sv-s'; d.innerHTML = `<div class="fl" style="background-image:url(${sm(r, p[0])})"></div><img class="${p[1] < .9 && r.k !== 'g' ? 'cv' : ''}" src="${big(r, p[0])}" alt="${esc(r.t)}">`; return d; }
function svBars() { $$('#svBars s i').forEach((b, j) => b.style.transform = `scaleX(${j < S.pi ? 1 : 0})`); }
function loadRep(ri, pi, dir) {
  const old = $$('.sv-s', $('#svC')); S.ri = ri; const r = S.list[ri];
  seen.add(r.id); store.set('ses5-seen', [...seen].join(','));
  $('#svT').textContent = r.t; $('#svK').textContent = CAT(r) + ' · ' + r.ph.length + (r.k === 'g' ? ' visuels' : ' photos');
  $('#svAv').src = sm(r, r.ph[0][0]); $('#svBars').innerHTML = r.ph.map(() => '<s><i></i></s>').join('');
  $('#svPR').style.visibility = ri > 0 ? '' : 'hidden'; $('#svNR').style.visibility = ri < S.list.length - 1 ? '' : 'hidden';
  if (dir && !RM) {
    const nl = layer(r, r.ph[pi]); nl.style.zIndex = 1; $('#svC').insertBefore(nl, $('#svBars'));
    anim(nl, [{transform: `translateX(${dir * 100}%)`}, {transform: 'none'}], {duration: 560, easing: IOE});
    old.forEach(o => { anim(o, [{transform: 'none', opacity: 1}, {transform: `translateX(${-dir * 30}%)`, opacity: .3}], {duration: 560, easing: IOE}); setTimeout(() => o.remove(), 580); });
    S.pi = pi; svBars(); S.t0 = performance.now(); S.el = 0; $('#svAmb').style.backgroundImage = `url(${sm(r, r.ph[pi][0])})`; $('#svCap').textContent = r.ph[pi][2] || '';
    return;
  }
  old.forEach(o => o.remove()); showPh(pi, true);
}
function showPh(pi, first) {
  const r = S.list[S.ri]; S.pi = pi; const p = r.ph[pi];
  svBars(); $('#svCap').textContent = p[2] || ''; S.busy = true; S.el = 0;
  const im = preload(big(r, p[0]));
  const done = () => { const nl = layer(r, p); if (!first && !RM) $('img', nl).classList.add('fd'); const prev = $$('.sv-s', $('#svC')); $('#svC').insertBefore(nl, $('#svBars')); setTimeout(() => prev.forEach(o => o.remove()), 260); $('#svAmb').style.backgroundImage = `url(${sm(r, p[0])})`; S.busy = false; S.t0 = performance.now(); S.el = 0; if (r.ph[pi + 1]) preload(big(r, r.ph[pi + 1][0])); };
  im.complete ? done() : (im.onload = im.onerror = done);
}
function nextRep(dir) { const j = S.ri + dir; if (j < 0) return showPh(0); if (j >= S.list.length) return closeSV(); loadRep(j, 0, dir); }
function svNext() { const r = S.list[S.ri]; if (S.pi < r.ph.length - 1) showPh(S.pi + 1); else nextRep(1); }
function svPrev() { if (S.pi > 0) showPh(S.pi - 1); else nextRep(-1); }
function svTick(now) { if (!S.open) return; if (S.paused || S.busy) S.t0 = now - S.el; S.el = now - S.t0; const p = clamp(S.el / S.DUR, 0, 1), bar = $$('#svBars s i')[S.pi]; if (bar) bar.style.transform = `scaleX(${p})`; if (p >= 1 && !S.busy) svNext(); requestAnimationFrame(svTick); }
{ let hold = 0, sx = 0, sy = 0, used = false; const c = $('#svC');
  c.addEventListener('pointerdown', e => { if (e.target.closest('.sv-hd,.sv-ft')) return; sx = e.clientX; sy = e.clientY; used = false; hold = setTimeout(() => { S.paused = true; used = true; }, 220); });
  c.addEventListener('pointerup', e => { clearTimeout(hold); S.paused = false; const dy = e.clientY - sy, dx = e.clientX - sx; if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { used = true; closeSV(); } else if (Math.abs(dx) > 60) { used = true; nextRep(dx < 0 ? 1 : -1); } });
  $('#svN').addEventListener('click', () => { if (!used) svNext(); });
  $('#svP').addEventListener('click', () => { if (!used) svPrev(); }); }
$('#svX').onclick = closeSV;
$('#svPR').onclick = () => nextRep(-1);
$('#svNR').onclick = () => nextRep(1);
$('#svSh').onclick = async () => { const r = S.list[S.ri], url = location.origin + location.pathname + '#r=' + r.id; S.paused = true; try { if (navigator.share && !FINE) await navigator.share({title: r.t + ' · Studio ES', url}); else { await navigator.clipboard.writeText(url); toast('Lien du reportage copié'); } } catch (e) {} S.paused = false; };
$('#svMsg').onclick = () => { const r = S.list[S.ri]; closeSV(); $('#fM').value = `Bonjour,\n\nNous avons vu « ${r.t} » et aimerions quelque chose de similaire.\n\n`; openSheet('shM'); };
$('#svEst').onclick = () => { const r = S.list[S.ri]; closeSV(); openCfg({p: st.p, pal: r.k === 'g' ? 1 : 0}); };
addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (S.open) closeSV(); else if (sheetOpen) closeSheets(); else closePF(); }
  if (!S.open) return;
  if (e.key === 'ArrowRight') svNext(); if (e.key === 'ArrowLeft') svPrev();
  if (e.key === ' ') { e.preventDefault(); S.paused = !S.paused; }
});

/* ================= DOCK ================= */
const dock = $('#dock'), dk = $('#dk'), links = $$('a,button', dk);
let dockForced = false;
function dockOff(f) { dockForced = f; dockSync(); }
function dockSync() { dock.classList.toggle('off', dockForced || scrollY < innerHeight * .5); }
if (FINE && !RM) {
  dk.addEventListener('pointermove', e => links.forEach(a => { const r = a.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2)), s = 1 + .28 * Math.max(0, 1 - d / 110); a.style.transform = `translateY(${-(s - 1) * 20}px) scale(${s})`; }));
  dk.addEventListener('pointerleave', () => links.forEach(a => a.style.transform = ''));
}

/* ================= APPARITIONS ================= */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -6% 0px'});
$$('[data-in],.mk,.stories').forEach(el => io.observe(el));
$$('.t2,.rdv-t').forEach(h => $$('.mk', h).forEach((m, i) => m.firstElementChild.style.transitionDelay = i * .1 + 's'));

/* ================= DÉFILEMENT ================= */
const top = $('#top'); let lastY = scrollY, tk = false;
addEventListener('scroll', () => {
  if (tk) return; tk = true;
  requestAnimationFrame(() => {
    const y = scrollY; top.classList.toggle('sc', y > 30);
    if (y > 300 && y > lastY + 3) top.classList.add('hide'); else if (y < lastY - 3 || y < 300) top.classList.remove('hide');
    lastY = y; dockSync();
    const mid = innerHeight * .45; let cur = 'accueil';
    ['accueil', 'travaux', 'offre', 'rdv'].forEach(id => { if ($('#' + id).getBoundingClientRect().top <= mid) cur = id; });
    links.forEach(a => a.classList.toggle('on', a.dataset.s === cur));
    tk = false;
  });
}, {passive: true});
addEventListener('resize', moveInk);

/* ================= DÉPART ================= */
renderFeed(); moveInk(); dockSync();
if (document.fonts) document.fonts.ready.then(moveInk);
{ const h = location.hash;
  if (h.startsWith('#r=')) { const r = byId(h.slice(3)); if (r) { const list = r.k === 'g' ? GORD : ORD; openSV(list, list.indexOf(r), 0); } }
  else if (h === '#portfolio') openPF('all'); }
})();
