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

/* ---------- Images : apparition douce une fois chargées ---------- */
document.addEventListener('load', e => { const t = e.target; if (t && t.tagName === 'IMG') t.classList.add('ld'); }, true);
const markLoaded = root => $$('img', root).forEach(i => { if (i.complete && i.naturalWidth) i.classList.add('ld'); });

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

/* ---------- Focus : on entre dans chaque fenêtre et on revient d'où l'on vient ---------- */
const FOC = [];
function focusIn(el, sel) { FOC.push(document.activeElement); setTimeout(() => { const f = $(sel || 'button,a,input,[tabindex]', el); if (f) f.focus({preventScroll: true}); }, 60); }
function focusBack() { const f = FOC.pop(); if (f && f.focus) f.focus({preventScroll: true}); }

/* ---------- Ancres ---------- */
function goTo(el) { if (!el) return; window.scrollTo({top: el.getBoundingClientRect().top + scrollY - (el.id === 'accueil' ? 0 : 20), behavior: RM ? 'auto' : 'smooth'}); }
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const t = $(a.getAttribute('href')); if (!t) return;
  e.preventDefault(); closeSheets(); closeSV(); closePF(); goTo(t);
});
$$('[data-open-pf]').forEach(b => b.addEventListener('click', () => openPF(b.id === 'feedMore' ? (PFMAP[st.tab] || 'all') : 'all')));

/* ================= ACCUEIL : une photo par artiste, fondu rapide ================= */
const HERO = ['la-fouine-3', 'philippe-katerine-4', 'matmatah-10', 'danakil-4', 'franglish-5', 'genezio-3', 'fatal-bazooka-1', 'gael-faye-5'];
const por = $('#por'), amb = $('#amb'), dots = $('#hDots');
const H = {i: 0, busy: false, t0: 0, el: 0, dur: 5200, cur: $('#pImg')};
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
    amb.style.backgroundImage = `url(${smF(HERO[i])})`;
    requestAnimationFrame(() => requestAnimationFrame(() => nx.classList.add('in')));
    setTimeout(() => { old.remove(); nx.className = ''; H.busy = false; }, RM ? 0 : 600);
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
const startUp = () => { if (document.body.classList.contains('go')) return; document.body.classList.add('go'); if (!RM) anim(H.cur, [{opacity: 0}, {opacity: 1}], {duration: 900, easing: 'ease-out'}); };
H.cur.complete ? requestAnimationFrame(startUp) : (H.cur.onload = startUp, setTimeout(startUp, 2200));
$('#hCard').onclick = () => { const r = FMAP[HERO[H.i]][0]; openSV(SCENE, SCENE.indexOf(r), r.ph.findIndex(p => p[0] === HERO[H.i])); };

/* ================= LE TRAVAIL : stories + onglets par cible + grille ================= */
/* notoriété des artistes : les plus connus en premier */
const POP = ['philippe-katerine', 'matmatah', 'fatal-bazooka', 'la-fouine', 'gael-faye', 'bekar', 'rimk', 'danakil', 'axel-bauer', 'the-avener', 'synapson', 'bakermat', 'les-sheriff', 'biga-ranx', 'mentissa', 'kemmler', 'ramoneurs', 'dali', 'helena', 'franglish', 'genezio', 'sara-lugo', 'jahneration', 'feder', 'bushi', 'radio-byzance', 'aupinard', 'candeur-cyclone', 'perceval', 'starfish', 'atipycs'];
const rank = r => { const i = POP.indexOf(r.id); return i < 0 ? 99 : i; };
const SCENE = PHR.filter(r => r.k === 'scene').sort((a, b) => rank(a) - rank(b));
const PUB = PHR.filter(r => r.k === 'public'), COL = PHR.filter(isCol), ENT = PHR.filter(isEnt);
let ORD = [];
const GPREF = ['soute', 'identites', 'marelle', 'campagnes', 'signaletique', 'recrutement', 'affiches', 'atrium', 'budget'];
const GORD = GRR.slice().sort((a, b) => GPREF.indexOf(a.id) - GPREF.indexOf(b.id));
const FORUM = byId('forum-asso'), INAUG = byId('inauguration'), VOEUX = byId('voeux-ph'), COMM = byId('commemo');
/* [clé, libellé, reportages photo (stories et grille, dans l'ordre), projets graphiques] */
const TABS = [
  ['culture', 'Concerts et festivals', () => [...SCENE.slice(0, 5), PUB[0], ...SCENE.slice(5, 11), PUB[1], ...SCENE.slice(11), PUB[2]], ['soute', 'marelle', 'atrium', 'affiches']],
  ['collectivite', 'Collectivités', () => [INAUG, VOEUX, FORUM, COMM], ['campagnes', 'signaletique', 'recrutement', 'budget']],
  ['entreprise', 'Entreprises', () => [...ENT], ['case:pierceval-tattoo', 'identites']],
  ['club', 'Clubs et assos', () => [FORUM, ...PUB], ['identites']],
  ['particulier', 'Particuliers', () => [...PUB], []],
  ['graph', 'Graphisme', () => [], ['*']],
  ['web', 'Sites et outils', () => [], []]
];
const PFMAP = {culture: 'scene', collectivite: 'col', entreprise: 'ent', club: 'public', particulier: 'photo', graph: 'graph'};
const stories = $('#stories');
function renderStories() {
  stories.style.display = ORD.length ? '' : 'none';
  stories.innerHTML = ORD.map((r, i) => `<button class="sto${seen.has(r.id) ? ' seen' : ''}" data-i="${i}" style="transition-delay:${Math.min(i, 12) * 30}ms"><span class="ring"><span><img src="${sm(r, (COVER[r.id] || r.ph[0][0]))}" alt="" loading="lazy"></span></span><b>${esc(r.t)}</b></button>`).join('');
  stories.scrollLeft = 0; markLoaded(stories); edge(stories);
}
stories.addEventListener('click', e => { const b = e.target.closest('.sto'); if (b && !goCase(ORD[+b.dataset.i])) openSV(ORD, +b.dataset.i, 0); });

const SZ = {L: [6, 4, 6, 2, 2], M: [3, 2, 3, 1, 1], W: [6, 2, 6, 2, 1], T: [4, 3, 6, 2, 2]};
const sz = s => { const z = SZ[s]; return `--cw:${z[0]};--ch:${z[1]};--tw:${z[2]};--mw:${z[3]};--mh:${z[4]}`; };
/* couverture choisie pour chaque projet graphique : l'image la plus lisible, la moins chargée */
const COVER = {soute: 'soute-7', marelle: 'marelle-1', atrium: 'atrium-1', budget: 'budget-1', recrutement: 'recrutement-1', identites: 'molan-move-1', signaletique: 'totem-1', campagnes: 'voeux-1', affiches: 'affiches-8'};
const CASE_OF = {soute: 'la-soute', marelle: 'mjc-la-marelle'};
const caseFor = r => CASE_OF[r.id] && CASES.find(x => x.id === CASE_OF[r.id]);
const coverOf = (r, s) => (COVER[r.id] && (s !== 'W' || r.ph.find(p => p[0] === COVER[r.id])[1] > 1.2) && r.ph.find(p => p[0] === COVER[r.id])) || r.ph.find(p => s === 'W' ? p[1] > 1.2 : p[1] < 1.2) || r.ph[0];
const cardCC = (c, i) => `<a class="cc" href="${c.url}" style="--i:${i}"><span class="cc-i"><img src="${c.img}" alt="" loading="lazy"></span><span class="cc-b"><span class="cc-m">${c.y} · ${esc(c.k)}</span><b class="d">${esc(c.t)}</b><em>${esc(c.s)}</em><span class="cc-t">${c.tags.map(t => `<i>${esc(t)}</i>`).join('')}</span><span class="cc-v">Voir le projet<span class="ic">${ico('a')}</span></span></span></a>`;
const ccs = $('#ccs');
function renderCC() {
  const l = st.tab === 'web' ? CASES.filter(c => c.web) : st.tab === 'graph' ? CASES.filter(c => c.g) : [];
  ccs.hidden = !l.length; ccs.classList.remove('in');
  ccs.innerHTML = l.length ? `<div class="cc-h"><h3 class="d">Études de cas</h3><span>${l.length} projets, du brief à la livraison</span></div><div class="cc-r">${l.map(cardCC).join('')}</div>` : '';
  if (l.length) { const r = $('.cc-r', ccs); dragScroll(r); markLoaded(ccs); requestAnimationFrame(() => requestAnimationFrame(() => ccs.classList.add('in'))); }
}
const cardCase = (c, s) => `<a class="c ph k-site" href="${c.url}" style="${sz(s)}"><img class="bgi" src="${c.img}" alt="" loading="lazy"><span class="chip glass"><i></i>${c.k}</span><span class="bot"><h3>${esc(c.t)}</h3><span class="ic">${ico('ne')}</span></span></a>`;
function cardRep(r, s, list) {
  const f = coverOf(r, s);
  if (caseFor(r)) { const c = caseFor(r); return `<a class="c ph" href="${c.url}" style="${sz(s)}"><img class="bgi" src="${sm(r, f[0])}" alt="" loading="lazy" decoding="async"><span class="chip glass"><i></i>${c.k}</span><span class="chip glass cnt">Étude de cas</span><span class="bot"><h3>${esc(r.t)}</h3><span class="ic">${ico('ne')}</span></span></a>`; }
  return `<button class="c ph" data-r="${r.id}" data-l="${list}" data-sz="${s}" style="${sz(s)}"><img class="bgi" src="${sm(r, f[0])}" alt="" loading="lazy" decoding="async"><span class="bars">${r.ph.slice(0, 5).map(() => '<s><i></i></s>').join('')}</span><span class="chip glass"><i></i>${CAT(r)}</span><span class="chip glass cnt">${r.ph.length}${r.k === 'g' ? ' visuels' : ' photos'}</span><span class="bot"><h3>${esc(r.t)}</h3><span class="ic">${ico('ne')}</span></span></button>`;
}
const TX = (ic, t, p, cfg) => `<button class="c k-tx" data-cfg="${cfg || ''}" style="${sz('M')}">${ico(ic).replace('<svg', '<svg class="big"')}<span><h3>${t}</h3><p>${p}</p></span></button>`;
const feed = $('#feed');
const LAY = ['L', 'M', 'M', 'M', 'M', 'W', 'M', 'M'];
function renderFeed() {
  const T = TABS.find(t => t[0] === st.tab); let h = '';
  ORD = T[2]().filter(Boolean); renderStories();
  renderCC();
  if (st.tab === 'web') h = '';
  else if (st.tab === 'graph') { ORD = GORD.slice(); renderStories(); const G2 = GORD.filter(r => !CASE_OF[r.id]); h = G2.map((r, i) => cardRep(r, i % 6 === 0 ? 'L' : 'M', 'g')).join(''); }
  else {
    const ph = T[2]().filter(Boolean), items = [];
    ph.forEach(r => items.push([r, 'p']));
    T[3].forEach(id => { if (id.startsWith('case:')) { const c = CASES.find(x => x.id === id.slice(5)); if (c) items.push([c, 'c']); } else { const r = byId(id); if (r) items.push([r, 'g']); } });
    /* on alterne : 5 photos, puis le graphisme glissé dans la grille */
    const ng = items.filter(x => x[1] !== 'p'), mix = [...items.filter(x => x[1] === 'p').slice(0, 5), ng[0], ...items.filter(x => x[1] === 'p').slice(5), ...ng.slice(1)].filter(Boolean).slice(0, 8);
    h = mix.map((x, i) => x[1] === 'c' ? cardCase(x[0], LAY[i]) : cardRep(x[0], LAY[i], x[1])).join('');
  }
  feed.innerHTML = h; markLoaded(feed);
  $$('.c', feed).forEach((c, i) => { c.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(c); });
  $$('.c[data-r]', feed).forEach(bindCard);
  $$('.c[data-cfg]', feed).forEach(c => c.onclick = () => openCfg({p: c.dataset.cfg}));
  $('#feedMore').style.display = st.tab === 'web' ? 'none' : ''; feed.style.display = h ? '' : 'none';
}
const goCase = r => { const c = r && caseFor(r); if (c) { location.href = c.url; return true; } return false; };
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
tabs.insertAdjacentHTML('beforeend', TABS.map(([k, l]) => `<button role="tab" data-k="${k}">${l}</button>`).join(''));
st.tab = st.p && TABS.some(t => t[0] === st.p) ? st.p : 'culture';
function moveInk() { const b = $(`button[data-k="${st.tab}"]`, tabs); if (!b) return; ink.style.width = b.offsetWidth + 'px'; ink.style.transform = `translateX(${b.offsetLeft - 5}px)`; ink.style.left = '5px'; $$('button', tabs).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); tabs.scrollTo({left: b.offsetLeft - (tabs.clientWidth - b.offsetWidth) / 2, behavior: 'smooth'}); }
tabs.addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b || b.dataset.k === st.tab) return; st.tab = b.dataset.k; if (P[st.tab]) { st.p = st.tab; store.set('ses5', st.p); } moveInk(); renderFeed(); });

/* rangées défilantes : glisser à la souris, fondu de bord tant qu'il reste du contenu */
function edge(el) { el.classList.toggle('end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 4); }
function dragScroll(el) {
  let down = false, x0 = 0, s0 = 0, moved = 0;
  el.addEventListener('scroll', () => edge(el), {passive: true});
  el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; x0 = e.clientX; s0 = el.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - x0; moved = Math.max(moved, Math.abs(d)); if (moved > 5) { el.classList.add('drag'); el.scrollLeft = s0 - d; } });
  addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => el.classList.remove('drag'), 0); });
  el.addEventListener('click', e => { if (moved > 5) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
  edge(el);
}
dragScroll(stories); dragScroll(tabs);

/* carte Photographie : les reportages défilent en fondu (concert, festival, institution, entreprise) */
{ const c = $('.mtc[data-rot]'), ids = c.dataset.rot.split(','), first = $('img', c);
  const ims = [first, ...ids.slice(1).map(id => { const im = document.createElement('img'); im.alt = ''; im.loading = 'lazy'; im.className = 'off'; im.src = BASE + 'p/' + id + '.jpg'; c.insertBefore(im, first.nextSibling); return im; })];
  let k = 0;
  if (!RM) setInterval(() => { const b = c.getBoundingClientRect(); if (b.bottom < 0 || b.top > innerHeight || document.hidden) return; ims[k].classList.add('off'); k = (k + 1) % ims.length; ims[k].classList.remove('off'); }, 2800); }
/* quatre métiers : chaque carte ouvre la bonne rubrique */
$('#mt').addEventListener('click', e => {
  const b = e.target.closest('.mtc'); if (!b) return; const g = b.dataset.go;
  if (g === 'com') { foShow('com'); $('#offre').scrollIntoView({behavior: RM ? 'auto' : 'smooth'}); return; }
  if (st.tab !== g) { st.tab = g; moveInk(); renderFeed(); }
  $('#travaux').scrollIntoView({behavior: RM ? 'auto' : 'smooth'});
});
/* ================= PORTFOLIO PLEIN ÉCRAN ================= */
const CASES = [
  {id: 'la-soute', web: 1, g: 1, t: 'La Soute', k: 'Identité et site', y: 2026, s: 'Une salle, un hublot, une saison.', tags: ['Identité', 'Brochure', 'Affiches', 'Site'], q: 'la soute salle de spectacle concert saison brochure affiche identite site internet web billetterie', url: 'projets/la-soute/', img: 'projets/la-soute/img/cover.webp', ar: 1.43},
  {id: 'mjc-la-marelle', g: 1, t: 'MJC La Marelle', k: 'Brochure de saison', y: 2026, s: 'Une saison, vingt-quatre pages.', tags: ['Mise en page', 'Illustration', 'Photo'], q: 'mjc la marelle centre social scaer brochure saison mise en page illustration couverture', url: 'projets/mjc-la-marelle/', img: 'projets/mjc-la-marelle/img/cover.webp', ar: 1.43},
  {id: 'pierceval-tattoo', web: 1, t: 'Pierceval Tattoo', k: 'Site internet', y: 2026, s: 'Tatouage et piercing depuis 1995.', tags: ['Site', 'Réservation', 'Carte cadeau'], q: 'pierceval tattoo tatouage piercing site internet web scaer', url: 'projets/pierceval-tattoo/', img: 'projets/pierceval-tattoo/img/cover.webp', ar: 1.43},
  {id: 'flouz', web: 1, t: 'flouz.', k: 'Application', y: 2026, s: 'Le budget du mois, d’un coup d’œil.', tags: ['Application', 'Interface', 'Identité'], q: 'flouz application mobile budget finances app web', url: 'projets/flouz/', img: 'projets/flouz/img/cover.webp', ar: 1.43}];
const SEAS = ['soute', 'marelle', 'atrium'], CAMP = ['campagnes', 'recrutement', 'budget', 'affiches'];
const CH = [
  ['all', 'Tout', () => true], ['photo', 'Photographie', r => r.k !== 'g'], ['scene', 'Concerts', r => r.k === 'scene'], ['public', 'Festivals', r => r.k === 'public'],
  ['col', 'Collectivités', isCol], ['ent', 'Entreprises', isEnt], ['graph', 'Graphisme', r => r.k === 'g'], ['seas', 'Saisons culturelles', r => SEAS.includes(r.id)],
  ['id', 'Identités', r => r.id === 'identites'], ['camp', 'Campagnes', r => CAMP.includes(r.id)], ['sig', 'Signalétique', r => r.id === 'signaletique'], ['web', 'Web', () => false]
];
const pf = $('#pf'), pfG = $('#pfG'), pfQ = $('#pfQ'), pfC = $('#pfC');
const PF = {c: 'all', q: '', list: []};
const caseIn = c => c === 'all' || c === 'web';
pfC.innerHTML = CH.map(([k, l, f]) => `<button data-c="${k}">${l}<em>${REPS.filter(f).length + (caseIn(k) ? CASES.length : 0)}</em></button>`).join('');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function pfRender() {
  const f = CH.find(c => c[0] === PF.c)[2], q = norm(PF.q.trim());
  PF.list = REPS.filter(r => !(CASE_OF[r.id] && caseIn(PF.c)) && f(r) && (!q || norm(r.t + ' ' + CAT(r) + ' ' + r.ph.map(p => p[2] || '').join(' ')).includes(q)));
  $$('button', pfC).forEach(b => b.classList.toggle('on', b.dataset.c === PF.c));
  const cs = caseIn(PF.c) ? CASES.filter(c => !q || norm(c.t + ' ' + c.q).includes(q)) : [];
  $('#pfN').textContent = PF.list.length + cs.length;
  setTimeout(() => markLoaded(pfG), 0);
  pfG.innerHTML = PF.list.length + cs.length ? cs.map(c => `<a class="pc" href="${c.url}"><img src="${c.img}" alt="" loading="lazy" style="aspect-ratio:${c.ar}"><span class="chip glass"><i></i>${c.k}</span><span class="ti"><b>${esc(c.t)}</b><span>Étude de cas</span></span></a>`).join('') + PF.list.map((r, i) => { const p = r.ph.find(x => x[0] === COVER[r.id]) || r.ph[0]; return `<button class="pc" data-i="${i}" style="animation-delay:${Math.min(i, 16) * 35}ms"><img src="${sm(r, p[0])}" alt="" loading="lazy" style="aspect-ratio:${p[1]}"><span class="chip glass"><i></i>${CAT(r)}</span><span class="ti"><b>${esc(r.t)}</b><span>${r.ph.length}</span></span></button>`; }).join('') : '<p class="pf-empty">Aucun résultat. Essayez un autre mot.</p>';
}
pfC.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; PF.c = b.dataset.c; pfRender(); b.scrollIntoView({inline: 'nearest', block: 'nearest', behavior: 'smooth'}); });
pfQ.addEventListener('input', () => { PF.q = pfQ.value; pfRender(); });
pfG.addEventListener('click', e => { const b = e.target.closest('button.pc'); if (b && !goCase(PF.list[+b.dataset.i])) openSV(PF.list, +b.dataset.i, 0); });
function openPF(c) { PF.c = c || 'all'; pfRender(); pf.classList.add('on'); pf.scrollTop = 0; root.style.overflow = 'hidden'; dockOff(true); focusIn(pf, '#pfX'); }
function closePF() { if (!pf.classList.contains('on')) return; pf.classList.remove('on'); root.style.overflow = ''; dockOff(false); focusBack(); }
$('#pfX').onclick = closePF;

/* ================= PLAN LARGE : formules et tarifs, en cartes ================= */
/* Prix « à partir de » tirés de la grille du 15 oct. 2026, arrondis vers le haut (jamais sous la grille). */
function low(n) { let lo = Infinity, u = ''; n.calc[0].o.forEach(o => { if (o[1] != null && o[1] > 0 && o[1] < lo) { lo = o[1]; u = o[2] || ''; } }); return lo === Infinity ? null : [lo, u]; }
const unitS = u => u ? ' / ' + ({mois: 'mois', an: 'an', saison: 'saison', semaine: 'semaine'}[u]) : '';
const FO = [
  {k: 'photo', t: 'Photographie', n: 'Mariage, saison associative, collectivité à l’année : tous les cas sont dans le configurateur.', c: [
    {h: 'Prise de vue', s: 'Le reportage', p: 250, hot: 1, a: 'Une intervention pour un moment précis, des images retouchées et prêtes à servir.',
      inc: ['Concert, spectacle, cérémonie, inauguration ou journée en entreprise', 'Une sélection retouchée, livrée sous 72 h', 'Droits d’usage pour votre communication'],
      opt: [['Livraison le soir même', 100], ['Formats réseaux prêts à poster', 90], ['Heure supplémentaire sur place', 80]], go: {pal: 0}},
    {h: 'Tirage', s: 'Le reportage et ses supports', p: 530, a: 'Les mêmes images deviennent votre affiche, vos visuels réseaux, votre brochure.',
      inc: ['Le reportage', 'Une affiche et trois formats réseaux tirés des images', 'Deux allers-retours de corrections', 'Fichiers pour l’impression et le web'],
      opt: [['Kakémono ou roll-up', 140], ['Brochure de 8 à 16 pages', 550, 1]], go: {pal: 1}},
    {h: 'Exposition', s: 'Le suivi dans la durée', p: 340, u: 'mois', a: 'Un rythme défini ensemble, et une photothèque qui grandit avec votre actualité.',
      inc: ['Une demi-journée de reportage par mois', 'Des dates fixées ensemble, sans mensualité payée d’avance', 'Une photothèque classée, prête à servir', 'Engagement de 6 mois'],
      opt: [['Trois demi-journées par mois', 990, 2, 'mois'], ['Saison culturelle, 5 dates', 1190, 2]], go: {pal: 2}}]},
  {k: 'graph', t: 'Identité', n: 'Affiches, flyers, brochures, signalétique : chiffrés à l’unité dans le configurateur.', c: [
    {h: 'Logo', s: 'Le signe', p: 550, a: 'Un signe lisible partout, de l’enseigne à la photo de profil.',
      inc: ['Recherches et pistes présentées', 'Le logo et ses variantes : couleur, monochrome, réduit', 'Deux allers-retours de corrections', 'Fichiers pour l’impression et le web'],
      opt: [['Couleurs, typographies et motif', 210], ['Cartes de visite', 90]], go: {ol: "Logo", nl: 'Une identité, une campagne'}},
    {h: 'Identité', s: 'Le logo et ses règles', p: 990, hot: 1, a: 'Le logo et tout ce qui l’entoure, pour que chaque support se ressemble.',
      inc: ['Logo et variantes', 'Couleurs, typographies, motif', 'Charte graphique complète', 'Trois déclinaisons au choix : carte, affiche, réseaux…'],
      opt: [['Kakémono ou roll-up', 140], ['Signalétique, à la journée', 550]], go: {ol: "Identité complète", nl: 'Une identité, une campagne'}},
    {h: 'Identité et supports', s: 'Tout pour démarrer', p: 1250, a: 'L’identité complète et les supports du quotidien, prêts le jour de l’ouverture.',
      inc: ['L’identité complète', 'Cartes de visite et papier à en-tête', 'Signature mail', 'Deux gabarits pour les réseaux'],
      opt: [['Reportage photo de lancement', 370, 1], ['Affiche de lancement', 140]], go: {ol: "Identité et supports", nl: 'Une identité, une campagne'}}]},
  {k: 'web', t: 'Sites', n: 'Réservations, inscriptions, espace membres : fonctions sur mesure, chiffrées à la journée.', c: [
    {h: 'Une page', s: 'La vitrine', p: 990, a: 'Qui vous êtes, ce que vous proposez, comment vous joindre. L’essentiel, bien dit.',
      inc: ['Maquette sur mesure, à votre identité', 'Textes rédigés', 'Rapide, adapté au mobile, sans bandeau cookies', 'Référencement local et mise en ligne', 'Nom de domaine à votre nom'],
      opt: [['Hébergement et maintenance', 35, 0, 'mois'], ['Reportage photo pour le site', 370, 1]], go: {ol: "Site d'une page", nl: 'Un site internet'}},
    {h: '3 à 5 pages', s: 'Une page par offre', p: 1890, hot: 1, a: 'Chaque offre a sa page, pour être trouvée sur Google et comprise en quelques secondes.',
      inc: ['Tout le site d’une page', 'Des pages dédiées à chaque offre', 'Formulaire de contact', 'Mesure d’audience sans cookie'],
      opt: [['Hébergement et maintenance', 35, 0, 'mois'], ['Configurateur ou calculateur de devis', 1100, 1]], go: {ol: "Site de 3 à 5 pages", nl: 'Un site internet'}},
    {h: 'Site complet', s: 'De 6 à 12 pages', p: 4400, a: 'Actualités, agenda, contenus : un site que vous faites vivre vous-même.',
      inc: ['Tout le site de 3 à 5 pages', 'Actualités ou agenda modifiables par vous', 'Reprise des contenus existants', 'Formation à la prise en main'],
      opt: [['Hébergement et maintenance', 35, 0, 'mois'], ['Fonctions sur mesure, à la journée', 550]], go: {ol: "Site complet", nl: 'Un site internet'}}]},
  {k: 'com', t: 'Réseaux et com', n: 'Plan de communication, relations presse, pack événement : détaillés dans le configurateur.', c: [
    {h: 'Remise à plat', s: 'Vos comptes, en ordre', p: 300, a: 'Un audit et un grand ménage, avant de publier mieux.',
      inc: ['Analyse du compte et de ce qui marche', 'Nettoyage, bio, mises en avant', 'Recommandations de rythme et de ton'],
      opt: [['Gabarits de publications et de stories', 210]], go: {nl: 'Mes réseaux sociaux suivis'}},
    {h: 'Réseaux suivis', s: 'Chaque mois', p: 240, u: 'mois', hot: 1, a: 'Des contenus produits en série, validés ensemble, prêts à publier.',
      inc: ['6, 12, 20 ou 30 contenus par mois', 'Visuels et textes', 'Un calendrier validé ensemble', 'Engagement de 6 mois'],
      opt: [['Publication par Studio ES', 70, 1, 'mois'], ['Reportage photo mensuel', 340, 0, 'mois']], go: {ol: '12 contenus par mois', nl: 'Mes réseaux sociaux suivis'}},
    {h: 'Service com', s: 'Externalisé', p: 550, u: 'mois', a: 'Un jour par mois ou un jour par semaine : site, réseaux, supports, presse.',
      inc: ['Un interlocuteur pour toute la communication', 'Coordination des imprimeurs et prestataires', 'Relations presse comprises', 'Remplacement possible pendant vos congés'],
      opt: [['Deux jours par mois', 1100, 2, 'mois'], ['Plan de communication annuel', 1100]], go: {ol: 'Appui ponctuel', nl: 'Un service com externalisé'}}]}
];
const foP = v => fmt(rUp(v));
const nb = t => t.replace(/(\d) (h|min|mois|pages|dates|à)\b/g, '$1\u00a0$2').replace(/ (€|:)/g, '\u00a0$1');
const foT = $('#foT'), foG = $('#foG'), foN = $('#foN'), foInk = $('.ink', foT);
let foK = 'photo', foSeen = false;
foT.insertAdjacentHTML('beforeend', FO.map(f => `<button role="tab" data-f="${f.k}" aria-selected="false">${f.t}</button>`).join(''));
function foInkMove() { const b = $(`button[data-f="${foK}"]`, foT); if (!b) return; foInk.style.width = b.offsetWidth + 'px'; foInk.style.transform = `translateX(${b.offsetLeft - 5}px)`; }
function foRender() {
  const f = FO.find(x => x.k === foK);
  $$('button', foT).forEach(b => { const on = b.dataset.f === foK; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  foG.classList.remove('in');
  foG.innerHTML = f.c.map((c, i) => `<article class="fo${c.hot ? ' hot' : ''}" style="--i:${i}">
    <div class="fo-h"><h3 class="d">${c.h}</h3>${c.hot ? '<span class="fo-b">Le plus demandé</span>' : ''}</div>
    <p class="fo-s">${c.s}</p>
    <p class="fo-p"><small>à partir de</small><b class="d">${foP(c.p)} €</b>${c.u ? `<em>par ${c.u}</em>` : ''}</p>
    <p class="fo-a">${nb(c.a)}</p>
    <h4>Compris</h4><ul class="fo-c">${c.inc.map(x => `<li><svg><use href="#ok"/></svg><span>${nb(x)}</span></li>`).join('')}</ul>
    ${c.opt.length ? `<h4>En option</h4><ul class="fo-o">${c.opt.map(o => `<li><span>${nb(o[0])}</span><b>${['+', 'dès ', ''][o[2] || 0]}${foP(o[1])} €${o[3] ? ' / ' + o[3] : ''}</b></li>`).join('')}</ul>` : ''}
    <div class="fo-f"><button class="bt ${c.hot ? 'bt-a' : 'bt-g'} pi bt-s" data-fi="${i}">Composer mon devis<span class="o"><svg><use href="#a"/></svg></span></button><a href="#rdv" data-rdv>ou réserver un appel de 30 min</a></div>
  </article>`).join('');
  foN.innerHTML = f.n.replace(/configurateur/, '<button type="button" data-cfg>configurateur</button>');
  foG.scrollLeft = 0; foInkMove();
  if (foSeen) requestAnimationFrame(() => requestAnimationFrame(() => foG.classList.add('in')));
}
function foShow(k) { if (FO.some(f => f.k === k) && k !== foK) { foK = k; foRender(); } }
foT.addEventListener('click', e => { const b = e.target.closest('button[data-f]'); if (b) foShow(b.dataset.f); });
foT.addEventListener('keydown', e => { const d = {ArrowRight: 1, ArrowLeft: -1}[e.key]; if (!d) return; e.preventDefault(); const i = clamp(FO.findIndex(f => f.k === foK) + d, 0, FO.length - 1); foShow(FO[i].k); $$('button', foT)[i].focus(); });
foG.addEventListener('click', e => {
  const b = e.target.closest('button[data-fi]');
  if (b) { const go = FO.find(f => f.k === foK).c[+b.dataset.fi].go, p = st.p && P[st.p] && (go.pal != null || P[st.p].n.some(x => x.l === go.nl)) ? st.p : go.pal != null ? 'culture' : 'entreprise'; openCfg(Object.assign({p}, go)); }
});
foN.addEventListener('click', e => { if (e.target.closest('[data-cfg]')) openCfg({}); });
dragScroll(foT);
foRender();
new IntersectionObserver(es => { if (es[0].isIntersecting) { foSeen = true; foG.classList.add('in'); } }, {threshold: .15}).observe(foG);
addEventListener('resize', foInkMove);
if (document.fonts) document.fonts.ready.then(foInkMove);

/* ================= CONFIGURATEUR (panier) ================= */
const CF = {step: 0, p: null, n: null, picks: [], basket: []};
try { CF.basket = JSON.parse(store.get('ses5-cart') || '[]'); } catch (e) { CF.basket = []; }
const cfg = $('#cfg');
const STEPS = ['Profil', 'Besoin', 'Formule', 'Récapitulatif'];
const saveCart = () => { store.set('ses5-cart', JSON.stringify(CF.basket)); const n = CF.basket.length; $('#estN').textContent = n; $('#estB').classList.toggle('has', n > 0); };
function openCfg(o = {}) {
  if (o.p) { CF.p = o.p; CF.step = 1; CF.n = null; if (o.nl) { const j = P[CF.p].n.findIndex(x => x.l === o.nl); if (j >= 0) { CF.n = j; initPicks(); CF.step = 2; } } else if (o.pal != null) { const j = P[CF.p].n.findIndex(x => x.pal === o.pal); if (j >= 0) { CF.n = j; initPicks(); CF.step = 2; } } }
  else CF.step = CF.basket.length && o.pal == null ? 3 : 0;
  if (o.ol && CF.n != null) { const g = P[CF.p].n[CF.n].calc[0], k = g.o.findIndex(x => x[0] === o.ol); if (k >= 0) CF.picks[0] = [k]; }
  cfgRender(); openSheet('shE');
}
function initPicks() { CF.picks = P[CF.p].n[CF.n].calc.map(g => g.m ? [] : [0]); }
function lineEst() { return CF.p != null && CF.n != null ? estimate(P[CF.p].n[CF.n].calc, CF.picks) : null; }
function cfgRender() {
  const s = CF.step;
  $('#prog').innerHTML = STEPS.map((t, i) => `<button data-s="${i}" class="${i < s ? 'dn' : i === s ? 'on' : ''}" ${i > s || (i === 3 && !CF.basket.length) ? 'disabled' : ''}><i></i>${t}</button>`).join('');
  let h = '';
  if (s === 0) h = `<div class="stp"><h3 class="d">Vous êtes</h3><div class="opts">${PROFS.map(([k, t, d]) => `<button class="op${CF.p === k ? ' on' : ''}" data-p="${k}">${t}<small>${d}</small></button>`).join('')}</div></div>`;
  if (s === 1) h = `<div class="stp"><h3 class="d">Vous cherchez</h3><div class="opts">${P[CF.p].n.map((x, i) => { const l = low(x); return `<button class="op${CF.n === i ? ' on' : ''}" data-n="${i}">${x.l}<small>${l ? 'dès ' + fmt(rNr(l[0])) + ' €' + unitS(l[1]) : 'sur devis'}</small></button>`; }).join('')}</div></div>`;
  if (s === 2) { const n = P[CF.p].n[CF.n]; h = `<div class="stp"><h3 class="d">${n.l}</h3>${n.calc.map((g, gi) => `<div class="grp"><h4>${g.q}${g.m ? ', au choix' : ''}</h4><div class="chs" data-g="${gi}">${g.o.map((o, oi) => `<button data-o="${oi}" class="${(CF.picks[gi] || []).includes(oi) ? 'on' : ''}">${o[0]}<em>${o[1] == null ? 'sur devis' : o[1] === 0 ? '' : (g.m ? '+' : '') + fmt(rNr(o[1])) + ' €' + unitS(o[2] || '')}</em></button>`).join('')}</div></div>`).join('')}</div>`; }
  if (s === 3) {
    const pub = CF.basket.some(b => b.p === 'collectivite');
    h = `<div class="stp"><h3 class="d">Votre sélection</h3><ul class="bask">${CF.basket.map((b, i) => `<li><span><b>${esc(b.l)}</b><small>${esc(b.labels.join(' · ') || 'Sur devis')}</small></span><span class="pr">${b.lo ? rangeF(b.lo) + unitS(b.unit) : 'Sur devis'}<button class="rm" data-rm="${i}">Retirer</button></span></li>`).join('')}</ul>
      <button class="addb" id="addMore">+ Ajouter un autre besoin</button>
      <p class="note">${pub ? 'Pour une collectivité : paiement après la prestation, sur facture. Le devis peut servir de base au bon de commande.' : 'À la commande : un acompte de 30 % sur la partie ponctuelle. Les formules mensuelles démarrent à une date fixée ensemble.'}</p>
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
  d.selection = CF.basket.map(b => `• ${b.l} : ${b.labels.join(', ')} (${b.lo ? rangeF(b.lo) + (b.unit ? ' ' + UNIT[b.unit] : '') : 'sur devis'})`).join('\n');
  d.total = t.lo ? rangeF(t.lo) : 'sur devis'; d.profil = (PROFS.find(p => p[0] === CF.basket[0].p) || [])[1] || '';
  d._subject = 'Demande de devis depuis studioes.fr'; d._template = 'table';
  btn.textContent = 'Envoi…';
  try { const r = await fetch('https://formsubmit.co/ajax/contact@studioes.fr', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(d)}); if (!r.ok) throw 0; CF.basket = []; saveCart(); closeSheets(); toast('Demande envoyée. Réponse sous 48 h.'); CF.step = 0; }
  catch (err) { ok.textContent = 'L\'envoi n\'a pas abouti. Écrivez à contact@studioes.fr.'; btn.textContent = 'Envoyer la demande'; }
}
$('#estB').onclick = () => openCfg({});
saveCart();

/* ================= FEUILLES ================= */
const veil = $('#veil'); let sheetOpen = null;
function openSheet(id) { if (!sheetOpen) FOC.push(document.activeElement); $$('.sheet.on').forEach(s => s.classList.remove('on')); const s = $('#' + id); setTimeout(() => { const f = $('[data-close]', s); if (f) f.focus({preventScroll: true}); }, 60); s.classList.add('on'); veil.classList.add('on'); sheetOpen = s; root.style.overflow = 'hidden'; dockOff(true); }
function closeSheets() { if (!sheetOpen) return; $$('.sheet.on').forEach(s => { s.classList.remove('on'); s.style.transform = ''; }); sheetOpen = null; veil.classList.remove('on'); focusBack(); if (!pf.classList.contains('on')) { root.style.overflow = ''; dockOff(false); } }
veil.onclick = closeSheets;
$$('[data-close]').forEach(b => b.onclick = closeSheets);
$$('.sheet .gr').forEach(g => { let y0 = 0, dy = 0; const s = g.parentElement;
  g.addEventListener('pointerdown', e => { y0 = e.clientY; dy = 0; g.setPointerCapture(e.pointerId); s.style.transition = 'none'; });
  g.addEventListener('pointermove', e => { if (!y0) return; dy = Math.max(0, e.clientY - y0); s.style.transform = `translate(-50%,${dy}px)`; });
  g.addEventListener('pointerup', () => { s.style.transition = ''; y0 = 0; if (dy > 110) closeSheets(); else s.style.transform = ''; }); });
$('#openMsg').onclick = () => openSheet('shM');
$('#ctDevis').onclick = () => openCfg({});
$$('[data-pf]').forEach(b => b.onclick = () => openPF(b.dataset.pf));
$$('[data-cfgp]').forEach(b => b.onclick = () => openCfg(b.dataset.cfgp ? {p: b.dataset.cfgp} : {}));
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
  Cal.ns.rdv('ui', {theme: 'dark', hideEventTypeDetails: true, layout: 'month_view', cssVarsPerTheme: {dark: {'cal-brand': '#E1DBC4', 'cal-brand-emphasis': '#ece7d6', 'cal-brand-text': '#191919', 'cal-bg': '#1A1A17', 'cal-bg-muted': '#23221F', 'cal-border': 'rgba(237,233,221,.12)', 'cal-text': '#EDE9DD'}}});
  setTimeout(() => { if (!$('iframe', calBox)) calFallback(); }, 7000);
}
new IntersectionObserver(es => { if (es[0].isIntersecting) calLoad(); }, {rootMargin: FINE ? '600px' : '150px'}).observe(calBox);

/* ================= STORIES PLEIN ÉCRAN ================= */
const sv = $('#sv');
const S = {list: [], ri: 0, pi: 0, t0: 0, el: 0, paused: false, open: false, busy: false, DUR: 4800};
function openSV(list, ri, pi = 0) { if (!S.open) focusIn(sv, '#svX'); S.list = list; S.open = true; sv.classList.add('on'); root.style.overflow = 'hidden'; dockOff(true); loadRep(ri, pi, 0); requestAnimationFrame(svTick); }
function closeSV() {
  if (!S.open) return; S.open = false; sv.classList.remove('on'); focusBack();
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
/* Apparitions : on vérifie la position à chaque défilement (plus fiable sur Safari iOS qu'un observateur) */
const REV = '[data-in]:not(.vis),.mk:not(.vis),.stories:not(.vis),.c:not(.vis)';
let revQ = false;
function reveal() { revQ = false; const lim = innerHeight * .96; $$(REV).forEach(el => { const r = el.getBoundingClientRect(); if (r.top < lim && r.bottom > -40) el.classList.add('vis'); }); }
function queueReveal() { if (revQ) return; revQ = true; requestAnimationFrame(reveal); }
const io = {observe: queueReveal, unobserve() {}};
addEventListener('scroll', queueReveal, {passive: true});
addEventListener('resize', queueReveal);
addEventListener('load', queueReveal);
setTimeout(() => $$(REV).forEach(el => { if (el.getBoundingClientRect().top < innerHeight * 3) el.classList.add('vis'); }), 2500);
$$('[data-in],.mk,.stories').forEach(el => io.observe(el));
$$('.t2').forEach(h => $$('.mk', h).forEach((m, i) => m.firstElementChild.style.transitionDelay = i * .1 + 's'));

/* ================= DÉFILEMENT ================= */
const top = $('#top'); let lastY = scrollY, tk = false;
addEventListener('scroll', () => {
  if (tk) return; tk = true;
  requestAnimationFrame(() => {
    const y = scrollY; top.classList.toggle('sc', y > 30);
    if (y > 300 && y > lastY + 3) top.classList.add('hide'); else if (y < lastY - 3 || y < 300) top.classList.remove('hide');
    lastY = y; dockSync(); document.body.classList.toggle('top-on', !top.classList.contains('hide'));
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
  const AL = {'#contact': '#rdv', '#portfolio': '#travaux', '#plan-large': '#offre', '#services': '#offre'};
  if (AL[h]) { history.replaceState(null, '', AL[h]); setTimeout(() => $(AL[h]).scrollIntoView(), 200); }
  if (h === '#devis') { history.replaceState(null, '', location.pathname); openCfg({}); }
  if (h.startsWith('#r=')) { const r = byId(h.slice(3)); if (r) { const list = r.k === 'g' ? GORD : ORD; openSV(list, list.indexOf(r), 0); } } }
})();
