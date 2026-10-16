/* Studio ES, refonte 2026. Code sans dépendance. */
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
const IO = 'cubic-bezier(.76,0,.24,1)';
const root = document.documentElement;

/* ---------- Données ---------- */
const FMAP = {}; REPS.forEach(r => r.ph.forEach(p => { FMAP[p[0]] = [r, p]; }));
const big = (r, f) => BASE + (r.old ? 'images/' : 'p/') + f + '.jpg';
const sm = (r, f) => BASE + (r.old ? 'images/t/' : 'p/t/') + f + '.webp';
const bigF = f => big(FMAP[f][0], f), smF = f => sm(FMAP[f][0], f);
const PHR = REPS.filter(r => r.k !== 'g'), GRR = REPS.filter(r => r.k === 'g');
const isEnt = r => r.id.startsWith('fl-auto');
const CAT = r => r.k === 'scene' ? 'Concert' : r.k === 'public' ? 'Festival' : r.k === 'g' ? 'Graphisme' : isEnt(r) ? 'Entreprise' : 'Collectivité';
P.autre = {t: 'Autre projet', n: [SITE, OUTIL, SUP, RS, COM()]};
const PROFS = [['culture', 'Lieu culturel, festival', 'Concerts, saisons, festivals'], ['collectivite', 'Collectivité', 'Commune, intercommunalité'], ['entreprise', 'Entreprise', 'Commerce, PME, lieu'], ['club', 'Club, association', 'Sport, culture, loisirs'], ['particulier', 'Particulier', 'Mariage, projet perso'], ['autre', 'Autre projet', 'Site, outil, application']];
const TABS = [['all', 'Pour vous'], ['culture', 'Culture'], ['collectivite', 'Collectivités'], ['entreprise', 'Entreprises'], ['club', 'Clubs et assos'], ['particulier', 'Particuliers']];

/* ---------- État ---------- */
const st = {p: 'all'};
{ const s = store.get('ses4'); if (s && TABS.some(t => t[0] === s)) st.p = s; }
const seen = new Set((store.get('ses4-seen') || '').split(',').filter(Boolean));
const L = [];
const on = f => L.push(f);
function setP(k) { st.p = k; store.set('ses4', k); L.forEach(f => f(k)); }
let toastT = 0;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2200); }

/* ---------- Ancres ---------- */
function goTo(el) { if (!el) return; window.scrollTo({top: el.getBoundingClientRect().top + scrollY - (el.id === 'accueil' ? 0 : 20), behavior: RM ? 'auto' : 'smooth'}); }
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const t = $(a.getAttribute('href')); if (!t) return;
  e.preventDefault(); closeSheets(); closeSV(); closePF(); goTo(t);
});
$$('[data-open-pf]').forEach(b => b.addEventListener('click', () => openPF('all')));

/* ================= ACCUEIL : une photo par artiste, transition « du vignette au cadre » ================= */
const HERO = ['helena-3', 'philippe-katerine-1', 'jahneration-6', 'pub-petites-folies-5', 'kemmler-5', 'candeur-cyclone-3', 'sara-lugo-1', 'matmatah-6'];
const stage = $('#stage'), base = $('#hBase'), tray = $('#tray');
const H = {i: 0, busy: false, t0: 0, dur: 6500, user: false};
tray.innerHTML = HERO.map((f, i) => `<button role="tab" aria-label="${esc(FMAP[f][0].t)}" data-i="${i}"><img src="${smF(f)}" alt=""><i></i></button>`).join('');
const thumbs = $$('button', tray);
function heroMeta() {
  const f = HERO[H.i], r = FMAP[f][0];
  $('#hT').textContent = r.t; $('#hK').textContent = CAT(r) + ' · ' + r.ph.length + ' photos'; $('#hAv').src = smF(f);
  thumbs.forEach((b, j) => { b.classList.toggle('on', j === H.i); b.setAttribute('aria-selected', j === H.i); $('i', b).style.transform = 'scaleX(0)'; });
}
function heroGo(i) {
  if (H.busy || i === H.i) return; H.busy = true;
  const from = thumbs[i].getBoundingClientRect(), sr = stage.getBoundingClientRect();
  const u = bigF(HERO[i]), im = preload(u);
  const run = () => {
    H.i = i; heroMeta(); H.t0 = performance.now();
    if (RM) { base.src = u; H.busy = false; return; }
    const ov = document.createElement('img'); ov.className = 'im mor'; ov.src = u; ov.alt = '';
    stage.insertBefore(ov, $('#hCap'));
    const t = from.top - sr.top, l = from.left - sr.left, r = sr.right - from.right, b = sr.bottom - from.bottom;
    anim(ov, [{clipPath: `inset(${t}px ${r}px ${b}px ${l}px round 14px)`, transform: 'scale(1.12)'}, {clipPath: 'inset(0px 0px 0px 0px round 30px)', transform: 'scale(1)'}], {duration: 1150, easing: IO});
    anim(base, [{transform: 'scale(1.02)', filter: 'brightness(1)'}, {transform: 'scale(.96)', filter: 'brightness(.5)'}], {duration: 1150, easing: IO});
    setTimeout(() => { base.getAnimations().forEach(a => a.cancel()); base.src = u; setTimeout(() => { ov.remove(); H.busy = false; }, 60); }, 1180);
    preload(bigF(HERO[(i + 1) % HERO.length]));
  };
  im.complete ? run() : (im.onload = run, im.onerror = () => { H.busy = false; });
}
tray.addEventListener('click', e => { const b = e.target.closest('button'); if (b) heroGo(+b.dataset.i); });
let heroVis = true;
new IntersectionObserver(es => { heroVis = es[0].isIntersecting; }).observe(stage);
(function loop(now) {
  if (!H.t0) H.t0 = now;
  if (H.busy || !heroVis || document.hidden) H.t0 = now - (H.el || 0);
  H.el = now - H.t0;
  const p = clamp(H.el / H.dur, 0, 1), bar = $('i', thumbs[H.i]);
  if (bar) bar.style.transform = `scaleX(${p})`;
  if (p >= 1 && !H.busy) { H.el = 0; heroGo((H.i + 1) % HERO.length); }
  requestAnimationFrame(loop);
})(performance.now());
base.src = bigF(HERO[0]); heroMeta(); preload(bigF(HERO[1]));
const startUp = () => document.body.classList.add('go');
base.complete ? requestAnimationFrame(startUp) : (base.onload = startUp, setTimeout(startUp, 2200));
$('#hCap').onclick = () => { const r = FMAP[HERO[H.i]][0]; openSV(PHR, PHR.indexOf(r), r.ph.findIndex(p => p[0] === HERO[H.i])); };

/* ================= MÉTIERS ================= */
$('#nPh').textContent = PHR.length + ' reportages';
$('#nGr').textContent = GRR.length + ' projets';
{ const pv = $('#idxPv'), im = $('img', pv);
  $$('.idx button').forEach(b => {
    b.addEventListener('pointerenter', () => { if (!FINE) return; im.src = BASE + b.dataset.pv; pv.classList.add('on'); });
    b.addEventListener('pointerleave', () => pv.classList.remove('on'));
    b.addEventListener('pointermove', e => { pv.style.left = (e.clientX + 150) + 'px'; pv.style.top = e.clientY + 'px'; });
    b.onclick = () => { pv.classList.remove('on'); const g = b.dataset.go; if (g === 'photo') openPF('photo'); else if (g === 'graph') openPF('graph'); else openCfg({p: 'autre'}); };
  });
}

/* ================= REPORTAGES (aperçu) ================= */
const isCol = r => r.k === 'corp' && !isEnt(r);
const GROUPS = {
  all: [r => r.k === 'scene', r => r.k === 'public', r => r.k === 'corp'],
  culture: [r => r.k === 'scene', r => r.k === 'public'],
  collectivite: [isCol, r => r.k === 'public'],
  entreprise: [isEnt, r => r.k === 'corp', r => r.k === 'scene'],
  club: [r => r.k === 'public', r => r.id === 'forum-asso'],
  particulier: [r => r.k === 'public', r => r.k === 'scene']
};
function order(k) {
  const gs = GROUPS[k] || GROUPS.all, used = new Set(), lists = gs.map(g => PHR.filter(g));
  const out = []; let i = 0, more = true;
  while (more) { more = false; lists.forEach(l => { const r = l[i]; if (r) { more = true; if (!used.has(r.id)) { used.add(r.id); out.push(r); } } }); i++; }
  PHR.forEach(r => { if (!used.has(r.id)) out.push(r); });
  return out;
}
let ORD = order(st.p);
const stories = $('#stories'), rail = $('#rail'), tabs = $('#tabs'), ink = $('#ink');
function renderStories() {
  stories.innerHTML = ORD.map((r, i) => `<button class="sto${seen.has(r.id) ? ' seen' : ''}" data-i="${i}" style="transition-delay:${Math.min(i, 12) * 35}ms"><span class="ring"><span><img src="${sm(r, r.ph[0][0])}" alt="" loading="lazy"></span></span><b>${esc(r.t)}</b></button>`).join('');
}
stories.addEventListener('click', e => { const b = e.target.closest('.sto'); if (b) openSV(ORD, +b.dataset.i, 0); });
function renderRail() {
  const six = ORD.slice(0, 6);
  rail.innerHTML = six.map((r, i) => { const f = r.ph.find(p => p[1] < 1) || r.ph[0]; return `<button class="rc" data-i="${i}" style="transition-delay:${i * 60}ms"><img src="${sm(r, f[0])}" alt="" loading="lazy"><span class="pill">${CAT(r)}</span><h3 class="d">${esc(r.t)}<small>${r.ph.length} photos</small></h3></button>`; }).join('')
    + `<button class="rc all" data-all style="transition-delay:${6 * 60}ms"><b class="d">${PHR.length + GRR.length}</b><span>reportages et projets, à filtrer et rechercher.</span><span class="ic">${ico('a')}</span></button>`;
}
rail.addEventListener('click', e => { const b = e.target.closest('.rc'); if (!b) return; if (b.hasAttribute('data-all')) openPF(st.p === 'all' ? 'all' : 'photo'); else openSV(ORD, +b.dataset.i, 0); });
tabs.insertAdjacentHTML('beforeend', TABS.map(([k, l]) => `<button role="tab" data-k="${k}">${l}</button>`).join(''));
function moveInk() { const b = $(`button[data-k="${st.p}"]`, tabs); if (!b) return; ink.style.width = b.offsetWidth + 'px'; ink.style.transform = `translateX(${b.offsetLeft}px)`; $$('button', tabs).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); }
tabs.addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (b && b.dataset.k !== st.p) setP(b.dataset.k); });
on(k => { ORD = order(k); renderStories(); renderRail(); moveInk(); if (rail.classList.contains('vis') && !RM) $$('.rc', rail).forEach((c, i) => anim(c, [{opacity: 0, transform: 'translateX(30px)'}, {opacity: 1, transform: 'none'}], {duration: 700, delay: i * 50})); plRender(); });

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
  pfG.innerHTML = PF.list.length ? PF.list.map((r, i) => { const p = r.ph[0]; return `<button class="pc" data-i="${i}" style="animation-delay:${Math.min(i, 16) * 35}ms"><img src="${sm(r, p[0])}" alt="" loading="lazy" style="aspect-ratio:${p[1]}"><span class="pill">${CAT(r)}</span><span class="ti"><b>${esc(r.t)}</b><span>${r.ph.length}</span></span></button>`; }).join('') : '<p class="pf-empty">Aucun résultat. Essayez un autre mot.</p>';
}
pfC.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; PF.c = b.dataset.c; pfRender(); b.scrollIntoView({inline: 'nearest', block: 'nearest', behavior: 'smooth'}); });
pfQ.addEventListener('input', () => { PF.q = pfQ.value; pfRender(); });
pfG.addEventListener('click', e => { const b = e.target.closest('.pc'); if (b) openSV(PF.list, +b.dataset.i, 0); });
function openPF(c) { PF.c = c || 'all'; pfRender(); pf.classList.add('on'); pf.scrollTop = 0; root.style.overflow = 'hidden'; dockOff(true); history.replaceState(null, '', '#portfolio'); }
function closePF() { if (!pf.classList.contains('on')) return; pf.classList.remove('on'); root.style.overflow = ''; dockOff(false); history.replaceState(null, '', location.pathname); }
$('#pfX').onclick = closePF;

/* ================= PLAN LARGE ================= */
const INC = [
  ['Le reportage, sur place', 'Une sélection resserrée, retouchée image par image', 'En option : livraison le jour même'],
  ['Les supports tirés du reportage : affiches, brochures, visuels réseaux', 'Une direction artistique commune'],
  ['Un suivi sur la saison ou sur l\'année', 'Un seul interlocuteur pour la photo et la communication']
];
const ZOOM = [['Plan serré', 'une date, un reportage'], ['Plan moyen', 'le reportage et ses supports'], ['Plan large', 'toute une saison']];
const GEN = [[250, ''], [280, ''], [240, 'mois']];
const PL = {i: 0, user: false};
const seg = $('#seg'), segInk = $('.ink', seg);
function low(n) { let lo = Infinity, u = ''; n.calc[0].o.forEach(o => { if (o[1] != null && o[1] > 0 && o[1] < lo) { lo = o[1]; u = o[2] || ''; } }); return lo === Infinity ? null : [lo, u]; }
const unitS = u => u ? ' / ' + ({mois: 'mois', an: 'an', saison: 'saison', semaine: 'semaine'}[u]) : '';
function plPrice(i) {
  const p = st.p !== 'all' ? P[st.p] : null;
  if (p) { const xs = p.n.filter(n => n.pal === i).map(low).filter(Boolean); if (xs.length) return xs.reduce((a, b) => b[0] < a[0] ? b : a); }
  return GEN[i];
}
function plRender(animIn) {
  const i = PL.i;
  $$('button', seg).forEach((b, j) => b.classList.toggle('on', j === i));
  segInk.style.transform = `translateX(${i * 100}%)`;
  $$('.vw', $('#plV')).forEach((v, j) => v.classList.toggle('on', j === i));
  $('#zoom').innerHTML = `<b>${ZOOM[i][0]}</b>${ZOOM[i][1]}`;
  $('#plH').textContent = PAL[i][0]; $('#plL').textContent = PAL[i][1];
  const items = [];
  for (let j = 0; j <= i; j++) INC[j].forEach(t => items.push([t, j === i && i > 0]));
  $('#inc').innerHTML = items.map(([t, nw], k) => `<li class="${nw ? 'nw' : ''}${nw && animIn ? ' add' : ''}" style="transition-delay:${k * 40}ms">${ico('ok')}<span>${esc(t)}</span></li>`).join('');
  if (animIn) requestAnimationFrame(() => requestAnimationFrame(() => $$('#inc li.add').forEach(li => li.classList.remove('add'))));
  const pr = plPrice(i); $('#plP').textContent = `${fmt(pr[0])} €${unitS(pr[1])}`;
  $('#plFk').textContent = st.p !== 'all' ? 'À partir de, pour ' + TABS.find(t => t[0] === st.p)[1].toLowerCase() : 'À partir de';
}
seg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; PL.user = true; PL.i = +b.dataset.i; plRender(true); });
$('#plGo').onclick = () => openCfg({p: st.p !== 'all' ? st.p : null, pal: PL.i});
/* visuels des paliers */
const BA = ['lf0008', 'ge0091', 'lf0157', 'ge0128', 'lf0031', 'ge0092', 'lf0092'];
let baI = 0; const ba = $('#ba');
function baSet(i) { baI = (i + BA.length) % BA.length; $('#baB').src = BASE + 'b/' + BA[baI] + '-brut.webp'; $('#baA').src = BASE + 'b/' + BA[baI] + '-retouche.webp'; }
{ let drag = false;
  const mv = x => { const r = ba.getBoundingClientRect(); ba.style.setProperty('--x', clamp((x - r.left) / r.width * 100, 2, 98) + '%'); };
  ba.addEventListener('pointerdown', e => { drag = true; PL.user = true; ba.setPointerCapture(e.pointerId); mv(e.clientX); });
  ba.addEventListener('pointermove', e => { if (drag || e.pointerType === 'mouse') mv(e.clientX); });
  ba.addEventListener('pointerup', () => drag = false);
  $('#baN').onclick = () => { PL.user = true; baSet(baI + 1); ba.style.setProperty('--x', '55%'); if (!RM) anim(ba, [{opacity: .2}, {opacity: 1}], {duration: 450}); };
}
$('#tiBg').src = BASE + 'p/t/helena-3.webp';
$('#tiFan').innerHTML = ['images/t/soute-3.webp', 'p/t/marelle-1.webp', 'p/t/affiches-2.webp'].map(u => `<img src="${BASE + u}" alt="" loading="lazy">`).join('');
$('#exMos').innerHTML = ['la-fouine-9', 'pub-eucalyptus-14', 'matmatah-7', 'forum-asso-6', 'danakil-4', 'pub-petites-folies-17', 'helena-1', 'inaug-digue-7', 'bekar-3', 'pub-festidreuz-4', 'rimk-4', 'voeux-ph-4'].map((f, i) => `<img src="${smF(f)}" alt="" loading="lazy" style="transition-delay:${i * 45}ms">`).join('');
baSet(0);
{ let vis = false; new IntersectionObserver(es => { vis = es[0].isIntersecting; }, {threshold: .4}).observe($('#plV'));
  setInterval(() => { if (vis && !PL.user && !document.hidden) { PL.i = (PL.i + 1) % 3; plRender(true); } }, 6000); }

/* ================= CONFIGURATEUR (avec panier) ================= */
const CF = {step: 0, p: null, n: null, picks: [], basket: []};
try { CF.basket = JSON.parse(store.get('ses4-cart') || '[]'); } catch (e) { CF.basket = []; }
const cfg = $('#cfg');
const STEPS = ['Profil', 'Besoin', 'Formule', 'Récapitulatif'];
const saveCart = () => { store.set('ses4-cart', JSON.stringify(CF.basket)); const n = CF.basket.length; $('#estN').textContent = n; $('#estB').classList.toggle('has', n > 0); };
function openCfg(o = {}) {
  if (o.p) { CF.p = o.p; CF.step = 1; CF.n = null; if (o.pal != null) { const j = P[CF.p].n.findIndex(x => x.pal === o.pal); if (j >= 0) { CF.n = j; initPicks(); CF.step = 2; } } }
  else if (o.pal != null || !CF.p) { CF.step = CF.basket.length && o.pal == null ? 3 : 0; }
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
  cfg.innerHTML = h; cfg.scrollTop = 0;
  cfgFoot();
}
function totals() {
  let lo = 0, devis = false; const rec = {};
  CF.basket.forEach(b => { if (b.devis && !b.lo) devis = true; if (b.unit) { rec[b.unit] = (rec[b.unit] || 0) + b.lo; } else lo += b.lo; if (b.devis) devis = true; });
  return {lo, hi: up50(lo * 1.2), rec, devis};
}
let shown = 0;
function countTo(el, to, f) {
  const from = shown; shown = to;
  if (RM || !from || from === to) { el.textContent = f(to); return; }
  const t0 = performance.now();
  (function tk(now) { const t = clamp((now - t0) / 600, 0, 1), v = Math.round(lerp(from, to, 1 - Math.pow(1 - t, 4)) / 10) * 10; el.textContent = f(t < 1 ? v : to); if (t < 1) requestAnimationFrame(tk); })(t0);
}
function cfgFoot() {
  const s = CF.step, tN = $('#tN'), tK = $('#tK'), tR = $('#tR'), act = $('#cfgAct');
  const back = `<button class="bt bt-g" data-back>Retour</button>`;
  tR.innerHTML = '';
  if (s < 2) { tK.textContent = CF.basket.length ? 'Votre sélection' : 'Estimation'; const t = totals(); if (CF.basket.length && t.lo) countTo(tN, t.lo, v => `${fmt(v)} à ${fmt(up50(v * 1.2))} €`); else { tN.textContent = s === 0 ? 'Choisissez' : P[CF.p].t; shown = 0; } act.innerHTML = s === 0 ? (CF.basket.length ? `<button class="bt bt-w" data-goto="3">Voir ma sélection (${CF.basket.length})</button>` : `<a class="bt bt-g" href="https://cal.eu/studioes/30min" target="_blank" rel="noopener">Plutôt en parler de vive voix</a>`) : back; return; }
  if (s === 2) {
    const e = lineEst(); tK.textContent = e.unit ? 'Estimation, ' + UNIT[e.unit] : 'Estimation';
    if (e.lo) countTo(tN, e.lo, v => `${fmt(v)} à ${fmt(up50(v * 1.2))} €`); else { tN.textContent = 'Sur devis'; shown = 0; }
    if (e.devis && e.lo) tR.innerHTML = '<small>plus une partie</small><b>sur devis</b>';
    act.innerHTML = back + `<button class="bt bt-l" data-add>Ajouter au devis${ico('a')}</button>`; return;
  }
  const t = totals(), recs = Object.entries(t.rec);
  if (t.lo) { tK.textContent = 'Total ponctuel'; countTo(tN, t.lo, v => `${fmt(v)} à ${fmt(up50(v * 1.2))} €`); tR.innerHTML = recs.map(([u, v]) => `<small>puis ${UNIT[u]}</small><b>${fmt(v)} à ${fmt(up50(v * 1.2))} €</b>`).join(''); }
  else if (recs.length) { const [u, v] = recs[0]; tK.textContent = 'Total, ' + UNIT[u]; countTo(tN, v, x => `${fmt(x)} à ${fmt(up50(x * 1.2))} €`); tR.innerHTML = recs.slice(1).map(([u2, v2]) => `<small>et ${UNIT[u2]}</small><b>${fmt(v2)} à ${fmt(up50(v2 * 1.2))} €</b>`).join(''); }
  else { tK.textContent = 'Total'; tN.textContent = 'Sur devis'; shown = 0; tR.innerHTML = ''; }
  act.innerHTML = `<a class="bt bt-g" href="https://cal.eu/studioes/30min" target="_blank" rel="noopener">Réserver un appel</a><button class="bt bt-l" data-send>Envoyer la demande</button>`;
}
$('#prog').addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.disabled) return; CF.step = +b.dataset.s; cfgRender(); });
cfg.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.p) { CF.p = b.dataset.p; CF.n = null; CF.step = 1; cfgRender(); return; }
  if (b.dataset.n != null) { CF.n = +b.dataset.n; initPicks(); CF.step = 2; cfgRender(); return; }
  if (b.dataset.o != null) {
    const gi = +b.parentElement.dataset.g, g = P[CF.p].n[CF.n].calc[gi], oi = +b.dataset.o;
    if (g.m) { const a = CF.picks[gi] || []; CF.picks[gi] = a.includes(oi) ? a.filter(x => x !== oi) : a.concat(oi); } else CF.picks[gi] = [oi];
    $$('button', b.parentElement).forEach(x => x.classList.toggle('on', (CF.picks[gi] || []).includes(+x.dataset.o)));
    cfgFoot(); return;
  }
  if (b.dataset.rm != null) { CF.basket.splice(+b.dataset.rm, 1); saveCart(); if (!CF.basket.length) CF.step = 0; cfgRender(); return; }
  if (b.id === 'addMore') { CF.step = CF.p ? 1 : 0; cfgRender(); }
});
$('#cfgAct').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.hasAttribute('data-back')) { CF.step = Math.max(0, CF.step - 1); cfgRender(); }
  if (b.dataset.goto) { CF.step = 3; cfgRender(); }
  if (b.hasAttribute('data-add')) {
    const n = P[CF.p].n[CF.n], e2 = lineEst();
    CF.basket.push({p: CF.p, l: n.l, ph: n.ph, labels: e2.labels, lo: e2.lo, hi: e2.hi, unit: e2.unit, devis: e2.devis});
    saveCart(); CF.step = 3; cfgRender();
    if (!RM) anim($('#estB'), [{transform: 'scale(1)'}, {transform: 'scale(1.18)'}, {transform: 'scale(1)'}], {duration: 600});
  }
  if (b.hasAttribute('data-send')) sendCfg(b);
});
async function sendCfg(btn) {
  const f = $('#cfgForm'), ok = $('#cfgOk');
  if (!f.name.value.trim() || !/\S+@\S+\.\S+/.test(f.email.value)) { ok.textContent = 'Merci de renseigner votre nom et votre e-mail.'; f.name.focus(); return; }
  const t = totals();
  const lines = CF.basket.map(b => `• ${b.l} : ${b.labels.join(', ')} (${b.lo ? fmt(b.lo) + ' à ' + fmt(b.hi) + ' €' + (b.unit ? ' ' + UNIT[b.unit] : '') : 'sur devis'})`).join('\n');
  const d = Object.fromEntries(new FormData(f));
  d.selection = lines; d.total = t.lo ? `${fmt(t.lo)} à ${fmt(t.hi)} €` : 'sur devis'; d.profil = (PROFS.find(p => p[0] === CF.basket[0].p) || [])[1] || '';
  d._subject = 'Demande de devis depuis studioes.fr'; d._template = 'table';
  btn.textContent = 'Envoi…';
  try {
    const r = await fetch('https://formsubmit.co/ajax/contact@studioes.fr', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(d)});
    if (!r.ok) throw 0;
    CF.basket = []; saveCart(); closeSheets(); toast('Demande envoyée. Réponse sous 48 h.'); CF.step = 0;
  } catch (err) { ok.textContent = 'L\'envoi n\'a pas abouti. Écrivez à contact@studioes.fr.'; btn.textContent = 'Envoyer la demande'; }
}
$('#estB').onclick = () => openCfg({});
saveCart();

/* ================= FEUILLES ================= */
const veil = $('#veil'); let sheetOpen = null;
function openSheet(id) { $$('.sheet.on').forEach(s => s.classList.remove('on')); const s = $('#' + id); s.classList.add('on'); veil.classList.add('on'); sheetOpen = s; root.style.overflow = 'hidden'; dockOff(true); }
function closeSheets() { if (!sheetOpen) return; $$('.sheet.on').forEach(s => { s.classList.remove('on'); s.style.transform = ''; }); sheetOpen = null; veil.classList.remove('on'); if (!pf.classList.contains('on')) { root.style.overflow = ''; dockOff(false); } }
veil.onclick = closeSheets;
$$('[data-close]').forEach(b => b.onclick = closeSheets);
$$('.sheet .gr').forEach(g => {
  let y0 = 0, dy = 0; const s = g.parentElement;
  g.addEventListener('pointerdown', e => { y0 = e.clientY; dy = 0; g.setPointerCapture(e.pointerId); s.style.transition = 'none'; });
  g.addEventListener('pointermove', e => { if (!y0) return; dy = Math.max(0, e.clientY - y0); s.style.transform = `translate(-50%,${dy}px)`; });
  g.addEventListener('pointerup', () => { s.style.transition = ''; y0 = 0; if (dy > 110) closeSheets(); else s.style.transform = ''; });
});
$('#openMsg').onclick = () => openSheet('shM');
$('#mlB').onclick = () => openSheet('shL');
$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, ok = $('#fOk'), b = $('#sendB');
  if (!f.name.value.trim() || !/\S+@\S+\.\S+/.test(f.email.value) || !f.message.value.trim()) { ok.textContent = 'Merci de renseigner votre nom, votre e-mail et votre projet.'; return; }
  b.textContent = 'Envoi…';
  try {
    const d = Object.fromEntries(new FormData(f)); d._subject = 'Nouveau message depuis studioes.fr'; d._template = 'table';
    const r = await fetch('https://formsubmit.co/ajax/contact@studioes.fr', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(d)});
    if (!r.ok) throw 0;
    f.reset(); closeSheets(); toast('Message envoyé. Réponse sous 48 h.'); b.textContent = 'Envoyer';
  } catch (err) { ok.textContent = 'L\'envoi n\'a pas abouti. Écrivez directement à contact@studioes.fr.'; b.textContent = 'Envoyer'; }
});

/* ================= RENDEZ-VOUS : agenda Cal.com intégré, calendrier maison en secours ================= */
const calBox = $('#calEmbed');
function calFallback() {
  if (calBox.dataset.fb) return; calBox.dataset.fb = 1;
  calBox.innerHTML = `<div class="cal-fb"><div class="mo"><b id="moT"></b><div><button class="ic" id="moP" aria-label="Mois précédent">${ico('al')}</button><button class="ic" id="moN" aria-label="Mois suivant">${ico('a')}</button></div></div><div class="wd" aria-hidden="true"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="days" id="days"></div><div class="cal-go"><p id="calTx">Choisissez un jour<b>&nbsp;</b></p><a class="bt bt-l bt-s" id="calGo" href="https://cal.eu/studioes/30min" target="_blank" rel="noopener">Voir les créneaux${ico('a')}</a></div></div>`;
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
  Cal.ns.rdv('ui', {theme: 'dark', hideEventTypeDetails: true, layout: 'month_view', cssVarsPerTheme: {dark: {'cal-brand': '#C9BBFF', 'cal-brand-emphasis': '#d8ceff', 'cal-brand-text': '#141318', 'cal-bg': '#16151C', 'cal-bg-muted': '#1E1D26', 'cal-border': 'rgba(238,234,227,.12)', 'cal-text': '#EEEAE3'}}});
  setTimeout(() => { if (!$('iframe', calBox)) calFallback(); }, 7000);
}
new IntersectionObserver(es => { if (es[0].isIntersecting) calLoad(); }, {rootMargin: '600px'}).observe(calBox);

/* ================= STORIES PLEIN ÉCRAN ================= */
const sv = $('#sv'), svS = $('#svS');
const S = {list: [], ri: 0, pi: 0, t0: 0, el: 0, paused: false, open: false, busy: false, DUR: 4800};
function openSV(list, ri, pi = 0) {
  S.list = list; S.open = true; sv.classList.add('on'); root.style.overflow = 'hidden'; dockOff(true);
  loadRep(ri, pi, 0); requestAnimationFrame(svTick);
}
function closeSV() {
  if (!S.open) return; S.open = false; sv.classList.remove('on');
  if (!pf.classList.contains('on') && !sheetOpen) { root.style.overflow = ''; dockOff(false); }
  $$('.sto', stories).forEach(b => b.classList.toggle('seen', seen.has(ORD[+b.dataset.i].id)));
  if (location.hash.startsWith('#r=')) history.replaceState(null, '', location.pathname);
}
function layer(r, p) {
  const d = document.createElement('div'); d.className = 'sv-s';
  d.innerHTML = `<div class="fl" style="background-image:url(${sm(r, p[0])})"></div><img class="${p[1] < .9 && r.k !== 'g' ? 'cv' : ''}" src="${big(r, p[0])}" alt="${esc(r.t)}">`;
  return d;
}
function loadRep(ri, pi, dir) {
  const old = $$('.sv-s', $('#svC'));
  S.ri = ri; const r = S.list[ri];
  seen.add(r.id); store.set('ses4-seen', [...seen].join(','));
  $('#svT').textContent = r.t; $('#svK').textContent = CAT(r) + ' · ' + r.ph.length + (r.k === 'g' ? ' visuels' : ' photos');
  $('#svAv').src = sm(r, r.ph[0][0]);
  $('#svBars').innerHTML = r.ph.map(() => '<s><i></i></s>').join('');
  $('#svPR').style.visibility = ri > 0 ? '' : 'hidden'; $('#svNR').style.visibility = ri < S.list.length - 1 ? '' : 'hidden';
  if (dir && !RM) {
    const nl = layer(r, r.ph[pi]); nl.style.zIndex = 1; $('#svC').insertBefore(nl, $('#svBars'));
    anim(nl, [{transform: `translateX(${dir * 100}%)`}, {transform: 'none'}], {duration: 560, easing: IO});
    old.forEach(o => { anim(o, [{transform: 'none', opacity: 1}, {transform: `translateX(${-dir * 30}%)`, opacity: .3}], {duration: 560, easing: IO}); setTimeout(() => o.remove(), 580); });
    S.pi = pi; svBars(); S.t0 = performance.now(); S.el = 0;
    $('#svAmb').style.backgroundImage = `url(${sm(r, r.ph[pi][0])})`; $('#svCap').textContent = r.ph[pi][2] || '';
    return;
  }
  old.forEach(o => o.remove());
  showPh(pi, true);
}
function svBars() { $$('#svBars s i').forEach((b, j) => b.style.transform = `scaleX(${j < S.pi ? 1 : 0})`); }
function showPh(pi, first) {
  const r = S.list[S.ri]; S.pi = pi; const p = r.ph[pi];
  svBars(); $('#svCap').textContent = p[2] || '';
  S.busy = true; S.el = 0;
  const im = preload(big(r, p[0]));
  const done = () => {
    const nl = layer(r, p); if (!first && !RM) $('img', nl).classList.add('fd');
    const prev = $$('.sv-s', $('#svC'));
    $('#svC').insertBefore(nl, $('#svBars'));
    setTimeout(() => prev.forEach(o => o.remove()), 260);
    $('#svAmb').style.backgroundImage = `url(${sm(r, p[0])})`;
    S.busy = false; S.t0 = performance.now(); S.el = 0;
    if (r.ph[pi + 1]) preload(big(r, r.ph[pi + 1][0]));
  };
  im.complete ? done() : (im.onload = im.onerror = done);
}
function nextRep(dir) { const j = S.ri + dir; if (j < 0) return showPh(0); if (j >= S.list.length) return closeSV(); loadRep(j, 0, dir); }
function svNext() { const r = S.list[S.ri]; if (S.pi < r.ph.length - 1) showPh(S.pi + 1); else nextRep(1); }
function svPrev() { if (S.pi > 0) showPh(S.pi - 1); else nextRep(-1); }
function svTick(now) {
  if (!S.open) return;
  if (S.paused || S.busy) S.t0 = now - S.el;
  S.el = now - S.t0;
  const p = clamp(S.el / S.DUR, 0, 1), bar = $$('#svBars s i')[S.pi];
  if (bar) bar.style.transform = `scaleX(${p})`;
  if (p >= 1 && !S.busy) svNext();
  requestAnimationFrame(svTick);
}
{ let hold = 0, sx = 0, sy = 0, used = false;
  const c = $('#svC');
  c.addEventListener('pointerdown', e => { if (e.target.closest('.sv-hd,.sv-ft')) return; sx = e.clientX; sy = e.clientY; used = false; hold = setTimeout(() => { S.paused = true; used = true; }, 220); });
  c.addEventListener('pointerup', e => { clearTimeout(hold); S.paused = false; const dy = e.clientY - sy, dx = e.clientX - sx; if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { used = true; closeSV(); } else if (Math.abs(dx) > 60) { used = true; nextRep(dx < 0 ? 1 : -1); } });
  $('#svN').addEventListener('click', () => { if (!used) svNext(); });
  $('#svP').addEventListener('click', () => { if (!used) svPrev(); });
}
$('#svX').onclick = closeSV;
$('#svPR').onclick = () => nextRep(-1);
$('#svNR').onclick = () => nextRep(1);
$('#svSh').onclick = async () => {
  const r = S.list[S.ri], url = location.origin + location.pathname + '#r=' + r.id;
  S.paused = true;
  try { if (navigator.share && !FINE) await navigator.share({title: r.t + ' · Studio ES', url}); else { await navigator.clipboard.writeText(url); toast('Lien du reportage copié'); } } catch (e) {}
  S.paused = false;
};
$('#svMsg').onclick = () => { const r = S.list[S.ri]; closeSV(); $('#fM').value = `Bonjour,\n\nNous avons vu « ${r.t} » et aimerions quelque chose de similaire.\n\n`; openSheet('shM'); };
$('#svEst').onclick = () => { const r = S.list[S.ri]; closeSV(); openCfg({p: st.p !== 'all' ? st.p : null, pal: r.k === 'g' ? 1 : 0}); };
addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (S.open) closeSV(); else if (sheetOpen) closeSheets(); else closePF(); }
  if (!S.open) return;
  if (e.key === 'ArrowRight') svNext();
  if (e.key === 'ArrowLeft') svPrev();
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
$$('[data-in],.mk,.stories,.rail').forEach(el => io.observe(el));
$$('.t2,.rdv-t').forEach(h => $$('.mk', h).forEach((m, i) => m.firstElementChild.style.transitionDelay = i * .1 + 's'));

/* ================= DÉFILEMENT ================= */
const top = $('#top'); let lastY = scrollY, tk = false;
addEventListener('scroll', () => {
  if (tk) return; tk = true;
  requestAnimationFrame(() => {
    const y = scrollY;
    top.classList.toggle('sc', y > 30);
    if (y > 300 && y > lastY + 3) top.classList.add('hide'); else if (y < lastY - 3 || y < 300) top.classList.remove('hide');
    lastY = y; dockSync();
    const mid = innerHeight * .45; let cur = 'accueil';
    ['accueil', 'reportages', 'offre', 'rdv'].forEach(id => { const s = $('#' + id); if (s.getBoundingClientRect().top <= mid) cur = id; });
    links.forEach(a => a.classList.toggle('on', a.dataset.s === cur));
    tk = false;
  });
}, {passive: true});
addEventListener('resize', moveInk);

/* ================= DÉPART ================= */
setP(st.p);
dockSync();
if (document.fonts) document.fonts.ready.then(moveInk);
{ const h = location.hash;
  if (h.startsWith('#r=')) { const r = REPS.find(x => x.id === h.slice(3)); if (r) { const list = r.k === 'g' ? GRR : PHR; openSV(list, list.indexOf(r), 0); } }
  else if (h === '#portfolio') openPF('all'); }
})();
