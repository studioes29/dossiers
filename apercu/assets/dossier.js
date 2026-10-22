(function(){
  var LOGO = '<svg viewBox="101 57 98 186" aria-hidden="true"><path fill="currentColor" d="M103.01,59.34h93.97s0,181.31,0,181.31h-93.97V59.34ZM195.66,60.67h-91.32v178.6s.17.18.18.18h91.14V60.67Z"/><polygon fill="currentColor" points="179.42 76.92 179.42 158.43 136.95 158.43 136.95 174.56 179.42 174.56 179.42 223.32 120.58 223.32 120.58 207.07 163.05 207.07 163.05 190.93 120.58 190.93 120.58 142.05 163.05 142.05 163.05 125.92 120.7 125.92 120.58 109.55 163.05 109.55 163.05 93.3 120.58 93.3 120.58 76.92 179.42 76.92"/></svg>';
  var EDGES = ['M0 60V30l60-8 50 14 70-20 80 16 60-10 90 18 70-22 80 12 60-6 90 20 70-18 80 10 60 8 70-16 80 14 50-8L1200 28V60Z','M0 60V46L1200 8V60Z','M0 60V10L1200 44V60Z'];
  var POLICES = {"Fraunces":"Fraunces:opsz,wght@9..144,600;9..144,700","DM Serif Display":"DM+Serif+Display","Playfair Display":"Playfair+Display:wght@600;700","Archivo":"Archivo:wght@600;700","Space Grotesk":"Space+Grotesk:wght@600;700","Libre Baskerville":"Libre+Baskerville:wght@700","Outfit":"Outfit:wght@600;700","Syne":"Syne:wght@600;700","Bitter":"Bitter:wght@600;700","Josefin Sans":"Josefin+Sans:wght@600;700"};
  var MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  var ICONES = {bien:'<path d="M5 12.5l4.5 4.5L19 7.5"/>', moyen:'<path d="M5 12h14"/>', absent:'<path d="M7 7l10 10M17 7L7 17"/>'};

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function url(s){ s = String(s || ""); return /^https:\/\//i.test(s) ? s.replace(/["'()\\\s]/g, encodeURIComponent) : ""; }
  function couleur(s, def){ return /^#[0-9a-f]{3,8}$/i.test(String(s || "")) ? s : def; }
  function eur(n){ return Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ") + " €"; }
  function plage(a, b){ return a === b ? eur(a) : Math.round(a).toLocaleString("fr-FR").replace(/ | /g, " ") + " à " + eur(b); }
  function dateFr(s){ var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ""); return m ? (+m[3] === 1 ? "1er" : +m[3]) + " " + MOIS[+m[2]-1] + " " + m[1] : ""; }
  function planche(cls, edge, inner, id){ return '<section class="pl ' + cls + '"' + (id ? ' id="' + id + '"' : '') + '>' + (edge != null ? '<svg class="edge" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true"><path d="' + EDGES[edge] + '"/></svg>' : '') + '<div class="in">' + inner + '</div></section>'; }
  function sur(hex){ var h = hex.replace("#",""); if(h.length === 3) h = h.replace(/./g, "$&$&"); var r = parseInt(h.substr(0,2),16), g = parseInt(h.substr(2,2),16), b = parseInt(h.substr(4,2),16); return (r*299 + g*587 + b*114) / 1000 > 150 ? "#111" : "#fff"; }

  function maquette(m){
    m = m || {}; var c = m.couleurs || {};
    var fond = couleur(c.fond, "#f4efe6"), texte = couleur(c.texte, "#1d1d1d"), accent = couleur(c.accent, "#8E2F2B");
    var police = POLICES[m.police] ? m.police : "Fraunces";
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + POLICES[police] + "&display=swap"; document.head.appendChild(l);
    var style = '--m-fond:' + fond + ';--m-texte:' + texte + ';--m-accent:' + accent + ';--m-sur-accent:' + sur(accent) + ";--m-police:'" + police + "';--m-rayon:" + (m.arrondi === false ? "2px" : "999px");
    if(m.type === "insta"){
      var cases = (m.cases || []).slice(0, 9), html = "";
      for(var i = 0; i < 9; i++){ var k = cases[i] || {}; var img = url(k.image); html += '<div class="' + (img ? "" : (i % 3 === 1 ? "ac" : "")) + '"' + (img ? ' style="background-image:url(' + img + ')"' : "") + '>' + (img ? "" : esc(k.texte || "")) + '</div>'; }
      var av = url(m.avatar);
      return '<div class="ecran insta" style="' + style + '"><div class="prof"><div class="av"' + (av ? ' style="background-image:url(' + av + ')"' : "") + '></div><b>' + esc(m.compte || m.titre) + '</b><span>' + esc(m.statsTexte || "") + '</span></div><p class="bio">' + esc(m.bio || m.sousTitre || "") + '</p><div class="grille">' + html + '</div></div>';
    }
    var image = url(m.image), menu = (m.menu || []).slice(0, 4), infos = (m.infos || []).slice(0, 3);
    var visu = image ? '<div class="vis" style="background-image:url(' + image + ')"></div>' : '<div class="vis ill">' + paysage() + (m.imageTexte ? '<p class="ph">' + esc(m.imageTexte) + '</p>' : '') + '</div>';
    var inf = infos.map(function(x){ return '<div class="inf"><b>' + esc(x.t) + '</b>' + (x.l || []).map(function(l){ return '<span>' + esc(l) + '</span>'; }).join("") + '</div>'; }).join("");
    var tel = '<div class="ecran" style="' + style + '"><div class="nav"><b>' + esc(m.logoTexte || m.titre) + '</b><i></i></div>' + visu +
      '<div class="txt"><h4>' + esc(m.titre) + '</h4>' + (m.sousTitre ? '<p>' + esc(m.sousTitre) + '</p>' : '') + (m.bouton ? '<span class="cta">' + esc(m.bouton) + '</span>' : '') + '</div>' +
      (inf ? '<div class="infs">' + inf + '</div>' : '<div class="blocs">' + menu.map(function(x){ return '<div>' + esc(x) + '</div>'; }).join("") + '</div>') + (m.pied ? '<p class="pied">' + esc(m.pied) + '</p>' : '') + '</div>';
    var pc = '<div class="pc"><div class="chrome"><i></i><i></i><i></i><span>' + esc(m.domaine || "votre-site.fr") + '</span></div><div class="site" style="' + style + '">' +
      '<div class="snav"><b>' + esc(m.logoTexte || m.titre) + '</b><span>' + menu.map(esc).join('</span><span>') + '</span>' + (m.bouton ? '<em>' + esc(m.bouton) + '</em>' : '') + '</div>' +
      '<div class="shero"><div class="stxt"><small>' + esc(m.surtitre || "") + '</small><h4>' + esc(m.titre) + '</h4>' + (m.sousTitre ? '<p>' + esc(m.sousTitre) + '</p>' : '') + (m.bouton ? '<span class="cta">' + esc(m.bouton) + '</span>' : '') + '</div>' + visu + '</div>' +
      (inf ? '<div class="sinf">' + inf + '</div>' : '') + (m.pied ? '<p class="spied">' + esc(m.pied) + '</p>' : '') + '</div></div>';
    return {tel:tel, pc:pc};
  }
  function paysage(){ return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="var(--m-accent)"/><circle cx="292" cy="96" r="34" fill="var(--m-fond)" opacity=".28"/><path d="M0 170 Q80 128 160 150 T300 138 T400 150 V300 H0Z" fill="var(--m-fond)" opacity=".16"/><path d="M0 205 Q100 165 200 190 T400 178 V300 H0Z" fill="var(--m-texte)" opacity=".22"/><path d="M0 240 Q120 214 230 236 T400 228 V300 H0Z" fill="var(--m-texte)" opacity=".38"/><path d="M0 268 H400 V300 H0Z" fill="var(--m-texte)" opacity=".5"/><path d="M40 268 h120 M210 268 h150" stroke="var(--m-fond)" stroke-opacity=".35" stroke-width="1.5"/></svg>'; }

  /* Trame 2027 v2 des dossiers (comme studioes.fr, en clair) : couverture papier avec le nom en grand et des raccourcis
     vers ce qui est proposé, puis des feuilles fixes qui alternent blanc et papier ; cartes alignées qui entrent de gauche à droite. */
  var AR = '<span class="ar"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
  var IC = {cal:'<path d="M4 6h16v14H4zM4 10h16M9 3v4M15 3v4"/>', mail:'<path d="M3 6h18v12H3z"/><path d="M3 7l9 6 9-6"/>', ok:'<path d="M5 12.5l4.5 4.5L19 7.5"/>'};
  /* couleur d'une piste selon son métier : pêche pour la photo, lavande pour le web, menthe pour les outils, rose pour les réseaux */
  function teinte(p){ var s = ((p.palier || "") + " " + (p.titre || "")).toLowerCase();
    if(/r[ée]seau|instagram|facebook|contenu/.test(s)) return "rs";
    if(/appli|outil|devis en ligne|r[ée]servation|automatis|notion|jeu|configur|inscription|demande/.test(s)) return "ou";
    if(/site|web|page|refonte/.test(s)) return "web";
    return "ph"; }
  function lettres(t){ var k = 0; return esc(t).split(" ").map(function(m){ return '<span class="m" style="--k:' + (k++) + '">' + m + '</span>'; }).join(" "); }
  function rendre(d){
    document.title = (d.nom || "Dossier") + " · Studio ES";
    var ct = d.contact || {}, rdv = url(ct.rdv) || "https://cal.eu/studioes/30min", mail = /^[^@\s]+@[^@\s]+$/.test(ct.mail || "") ? ct.mail : "contact@studioes.fr";
    var a = d.configurateur && (d.configurateur.etapes || []).length, ots = (d.outils || []).filter(function(x){ return OUTILS[x.type]; }).slice(0, 4);
    var pub = !!(d.configurateur && d.configurateur.public) || ots.length > 0;
    /* une maquette ne s'affiche que si elle est faite avec leur vraie matière (photo de leur site) ou validée par Ewen ("valide": true) */
    var mqm = d.maquette || null, vraie = mqm && (mqm.valide === true || url(mqm.image) || (mqm.cases || []).some(function(c){ return url(c && c.image); }));
    var mq = vraie ? maquette(mqm) : null, mtel = mq ? (typeof mq === "string" ? mq : mq.tel) : "", mpc = mq && typeof mq !== "string" ? mq.pc : "";
    var o = [], k = 0, teintes = ["bl", "pa"];
    function sec(id, titre, it, lead, corps, cls){ var c = cls || teintes[k++ % 2];
      o.push('<section class="fe ' + c + '" id="' + id + '"><div class="w"><div class="sec-t rv"><h2>' + esc(titre) + (it ? '<span class="it">' + esc(it) + '</span>' : '') + '</h2>' + (lead ? '<p class="lead">' + esc(lead) + '</p>' : '') + '</div>' + corps + '</div></section>'); }
    var pis = (d.pistes || []).slice(0, 3);
    if(!pis.length && (d.poles || []).length) pis = d.poles.slice(0, 3).map(function(p){ return {palier:p.titre, titre:p.texte || p.titre, texte:(p.items || []).join(", ")}; });

    o.push('<header class="tete" id="hd"><div class="w"><a class="sig" href="https://studioes.fr" aria-label="Studio ES, studioes.fr">' + LOGO + '<span><b>Studio ES</b><span>Photographie et web</span></span></a><a class="btn" href="' + rdv + '" target="_blank" rel="noopener">Choisir un créneau ' + AR + '</a></div></header>');

    /* couverture : le nom, l'accroche, puis les raccourcis vers chaque piste */
    var meta = [d.secteur, d.ville].filter(Boolean).join(", ");
    var rac = pis.map(function(p, n){ return '<a class="rc" href="#piste-' + (n + 1) + '" style="--i:' + n + '"><span class="sw"><em>' + esc(p.palier || "Piste " + (n + 1)) + '</em><i>' + (n + 1) + '</i></span><span class="lb"><b>' + esc(p.titre) + '</b>' + AR + '</span></a>'; });
    o.push('<section class="cv2"><div class="w"><div class="hd2">' + (meta ? '<p class="meta ap" style="--k:0">' + esc(meta) + '</p>' : '') +
      '<h1 class="' + ((d.nom || "").length > 22 ? "tres" : (d.nom || "").length > 12 ? "long" : "") + '">' + lettres(d.nom || "") + '</h1>' +
      (d.accroche ? '<p class="acc ap" style="--k:2">' + esc(d.accroche) + '</p>' : '') + '</div>' +
      (rac.length ? '<div class="rcs"><h2 class="rct ap" style="--k:3">Ce que nous vous proposons</h2><div class="rail" style="--n:' + rac.length + '">' + rac.join("") + '</div>' + (a ? '<div class="row ap" style="--k:4"><a class="btn" href="#prix">Composer votre offre ' + AR + '</a></div>' : '') + '</div>' : '') +
      (d.date ? '<p class="date ap" style="--k:5">Dossier préparé le ' + esc(dateFr(d.date)) + '</p>' : '') + '</div></section>');

    if((d.constats || []).length){ var cs = d.constats.slice(0, 4);
      sec("constats", d.titreConstats || "Ce que nous avons relevé", d.sousConstats || (d.titreConstats ? "" : "en vous cherchant."), d.texteConstats || "Votre site, vos réseaux, et ce que l'on trouve en tapant votre nom : ce qui fonctionne, ce qui manque.",
        '<div class="rail cts" style="--n:' + cs.length + '">' + cs.map(function(c, n){ var e = ICONES[c.etat] ? c.etat : "moyen", lien = url(c.lien);
          return '<article class="ct gd ' + e + '" style="--i:' + n + '"><div class="sw"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONES[e] + '</svg><em>' + ({bien:"Acquis",moyen:"À renforcer",absent:"Absent"})[e] + '</em></div><div class="lab"><h3>' + esc(c.titre) + '</h3><p>' + esc(c.texte) + (lien ? ' <a href="' + lien + '" target="_blank" rel="noopener">Voir</a>' : '') + '</p></div></article>'; }).join("") + '</div>'); }

    if(mq){ var pts = (d.maquette.points || []).slice(0, 4);
      sec("maquette", d.maquette.accroche || "À quoi cela pourrait ressembler", "", d.maquette.explication || "",
        (pts.length ? '<ul class="tirets rv">' + pts.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>' : '') +
        '<div class="cap3 rv' + (mpc ? "" : " solo") + '" style="margin-top:28px">' + mpc + '<div class="dv">' + mtel + '</div></div><p class="leg rv">' + esc(d.maquette.legende || "Une première piste, faite à partir de ce qui existe déjà. Elle se discute.") + '</p>'); }

    /* ce que nous proposons : les pistes, et pour une commune ce que le studio peut aussi prendre en charge (une seule rubrique) */
    if(pis.length){ var aussi = [];
      if((d.pistes || []).length) (d.poles || []).forEach(function(p){ (p.items || []).forEach(function(x){ if(aussi.indexOf(x) < 0) aussi.push(x); }); });
      sec("pistes", d.titrePistes || "Les pistes", d.sousPistes || (d.titrePistes ? "" : "pour commencer."), d.textePistes || (pis.length > 1 ? "Chaque piste se lance seule, à votre rythme. On peut très bien s'arrêter à la première." : ""),
        '<ol class="rail pis" style="--n:' + pis.length + '">' + pis.map(function(p, n){ return '<li class="pi gd" id="piste-' + (n + 1) + '" style="--i:' + n + '"><span class="sw"><em>' + esc(p.palier || "") + '</em><i>' + (n + 1) + '</i></span><div class="lab"><h3>' + esc(p.titre) + '</h3><p>' + esc(p.texte) + '</p></div></li>'; }).join("") + '</ol>' +
        (aussi.length ? '<div class="aussi rv"><p>Le studio peut aussi prendre en charge</p><ul>' + aussi.slice(0, 12).map(function(x){ return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>' : '')); }

    if(ots.length){ sec("outils", d.titreOutils || "Des outils", d.titreOutils ? "" : "faits pour vos services.", d.texteOutils || "Quelques exemples à essayer : ils fonctionnent. Chaque outil se construit avec les agents qui l'utiliseront, sur téléphone comme sur ordinateur.",
        '<div class="otabs rv" role="tablist">' + ots.map(function(x, n){ return '<button type="button" role="tab" data-t="' + n + '" aria-selected="' + (n === 0) + '">' + esc(x.titre || OUTILS[x.type].titre) + '</button>'; }).join("") + '</div><div class="odemo rv" id="odemo"></div>');
      d.__outils = ots; }

    if(a) sec("prix", "Votre projet", "chiffré en direct.", d.configurateur.intro || "Composez votre offre : le prix s'affiche au fur et à mesure, et le devis se génère tout de suite.", '<div class="cfg rv" id="cfg"></div>');

    /* fin : prendre rendez-vous, puis un pied de page qui aide à décider */
    var etapesFin = [["Un appel de 30 minutes", "Pour cerner le besoin et voir par quoi commencer. Sans engagement."],
      ["Un devis détaillé", "Chaque ligne chiffrée, ce qui est inclus écrit noir sur blanc."],
      pub ? ["Le démarrage à la date choisie", "Règlement sur facture après service fait, par mandat administratif."] : ["Le démarrage à la date choisie", "Un acompte de 30 % à la commande, le solde à la livraison."]];
    sec("contact", d.titreFin || "Prendre contact", d.titreFin ? "" : "trente minutes suffisent.", d.texteFin || "",
      '<div class="ct2"><a class="ca rec rv" href="' + rdv + '" target="_blank" rel="noopener"><i><svg viewBox="0 0 24 24">' + IC.cal + '</svg></i><span><b>Choisir un créneau</b><span>30 minutes, au téléphone ou en visio</span></span>' + AR + '</a>' +
      '<a class="ca rv" style="--i:1" href="mailto:' + esc(mail) + '?subject=' + encodeURIComponent("Dossier " + (d.nom || "")) + '"><i><svg viewBox="0 0 24 24">' + IC.mail + '</svg></i><span><b>Écrire</b><span>' + esc(mail) + '</span></span>' + AR + '</a></div>' +
      '<ol class="etp rail" style="--n:3">' + etapesFin.map(function(x, n){ return '<li class="gd" style="--i:' + n + '"><i>' + (n + 1) + '</i><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></li>'; }).join("") + '</ol>' +
      '<footer class="pied2"><div class="sg">' + LOGO + '<span><b>Studio ES</b><span>Photographie et web, en Bretagne</span></span></div>' +
      '<nav aria-label="Sur studioes.fr"><a href="https://studioes.fr/metiers/photographie/">Photographie</a><a href="https://studioes.fr/metiers/sites-et-outils/">Sites et applications</a></nav>' +
      '<div class="lg"><a href="https://studioes.fr">studioes.fr</a><span>Ewen Soupault, entrepreneur individuel · SIRET 834 922 486 00016 · TVA non applicable, art. 293 B du CGI</span></div></footer>', "pa fin");

    document.getElementById("app").innerHTML = o.join("");
    if(a) configurateur(d.configurateur, d);
    if(d.__outils) demos(d.__outils, d);
    typo(document.getElementById("app") || document.body); apparition();
  }

  /* ---------- configurateur : prix réels, devis PDF, acceptation, acompte ---------- */
  function configurateur(cf, D){
    var box = document.getElementById("cfg"); if(!box) return;
    var etapes = cf.etapes, choix = etapes.map(function(e){ return []; }), i = 0, client = {}, num = numero(), dejaTel = false;
    function numero(){ var t = new Date(), a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", s = ""; for(var k = 0; k < 4; k++) s += a.charAt(Math.floor(Math.random() * a.length)); return String(t.getFullYear()).slice(2) + ("0" + (t.getMonth() + 1)).slice(-2) + ("0" + t.getDate()).slice(-2) + "-" + s; }
    function visible(e, k){ var o = etapes[e].options[k]; if(!o.si) return true; var c = choix[o.si[0]]; return o.si[1].some(function(x){ return c.indexOf(x) >= 0; }); }
    /* ce qui est obligatoire (hébergement et suivi d'un site, par exemple) est coché d'office dès que l'étape s'applique */
    function nettoyer(){ etapes.forEach(function(e, n){ choix[n] = choix[n].filter(function(k){ return visible(n, k); });
      e.options.forEach(function(o, k){ if(o.obligatoire && visible(n, k) && choix[n].indexOf(k) < 0){ if(!e.multi) choix[n] = []; choix[n].push(k); } }); }); }
    function etapesVisibles(){ return etapes.map(function(e, n){ return n; }).filter(function(n){ return etapes[n].options.some(function(o, k){ return visible(n, k) && !o.aucun; }); }); }
    function lignes(){ var r = []; etapes.forEach(function(e, n){ choix[n].forEach(function(k){ var o = e.options[k]; if(o.aucun) return; r.push({n:(o.titreDevis || o.l) + (o.an ? ", par an" : ""), l:o.lignes || (o.d ? [o.d] : []), p:o.p || 0, mois:!!o.mois, min:o.min, devis:!!o.devis}); }); }); return r; }
    function totaux(){ var L = lignes(), a = 0, m = 0, dv = 0; L.forEach(function(x){ if(x.devis) dv++; else if(x.mois) m += x.p; else a += x.p; }); return {once:a, mois:m, devis:dv, lignes:L}; }
    function prix(o){ return o.aucun ? "" : o.devis ? "sur devis" : eur(o.p) + (o.mois ? " / mois" : o.an ? " / an" : ""); }
    function code(){ return choix.map(function(c){ return c.length ? c.join("") : "x"; }).join("-"); }

    /* une barre de progression continue, construite une fois : elle avance sans se redessiner ni sauter */
    box.innerHTML = '<div class="prog"><span class="pt"></span><span class="pb"><i></i></span></div><div class="stage"></div>';
    var stage = box.querySelector(".stage"), fill = box.querySelector(".pb i"), ptx = box.querySelector(".pt"), dejaN = -1;
    function avance(f, t){ fill.style.transform = "scaleX(" + Math.max(.04, Math.min(1, f)) + ")"; ptx.textContent = t; }
    function opt(n, o, k){ var on = choix[n].indexOf(k) >= 0;
      return '<button type="button" class="opt' + (o.obligatoire ? " oblig" : "") + '" data-k="' + k + '" aria-pressed="' + on + '"' + (o.obligatoire ? ' aria-disabled="true"' : '') + '><span class="ck"></span><b>' + esc(o.l) + '</b><span class="px">' + esc(prix(o)) + '</span>' +
        ((o.d || o.min || o.obligatoire) ? '<small>' + esc(o.d || "") + (o.min ? " Engagement de " + o.min + " mois minimum." : "") + (o.obligatoire ? '<span class="pq">Inclus d\'office' + (o.pourquoi ? " : " + esc(o.pourquoi) : ".") + '</span>' : '') + '</small>' : '') + '</button>'; }
    function pas(){
      nettoyer(); var V = etapesVisibles(); if(i >= V.length) return recap();
      var n = V[i], e = etapes[n];
      avance((i + 1) / (V.length + 1), "Étape " + (i + 1) + " sur " + V.length);
      if(n === dejaN){ /* même étape : on met seulement à jour les choix, rien ne bouge */
        stage.querySelectorAll(".opt").forEach(function(b){ b.setAttribute("aria-pressed", choix[n].indexOf(+b.dataset.k) >= 0); });
        var sv = stage.querySelector('[data-a="suiv"]'); if(sv) sv.disabled = !choix[n].length; return; }
      dejaN = n;
      var h = '<div class="q"><h3>' + esc(e.q) + '</h3>' + (e.aide ? '<p class="sm">' + esc(e.aide) + '</p>' : e.multi ? '<p class="sm">Plusieurs choix possibles.</p>' : '') + '</div><div class="opts">';
      e.options.forEach(function(o, k){ if(visible(n, k)) h += opt(n, o, k); });
      h += '</div><div class="nav2">' + (i ? '<button type="button" class="btn line" data-a="prec">Retour</button>' : '<span></span>') + '<button type="button" class="btn" data-a="suiv"' + (choix[n].length ? '' : ' disabled') + '>' + (i === V.length - 1 ? "Voir mon offre" : "Suivant") + '</button></div>';
      stage.innerHTML = h; stage.classList.remove("neuf"); void stage.offsetWidth; stage.classList.add("neuf"); box.dataset.n = n;
    }
    function recap(){
      var T = totaux(), h = '<h3>Votre offre</h3><ul class="recap">';
      T.lignes.forEach(function(x){ h += '<li><span>' + esc(x.n) + '</span><span>' + (x.devis ? "sur devis" : eur(x.p) + (x.mois ? " / mois" : "")) + '</span></li>'; });
      if(!T.lignes.length) h += '<li><span>Rien de sélectionné pour l\'instant</span><span></span></li>';
      h += '</ul><div class="total">';
      if(T.once){ h += '<b>' + eur(T.once) + '</b><span>' + (cf.public ? "hors abonnements, réglé sur facture après service fait (mandat administratif)" : "en une fois, dont un acompte de " + eur(T.once * .3) + " à la commande") + '</span>'; }
      if(T.mois) h += (T.once ? '<span class="plus">+ ' + eur(T.mois) + ' par mois' : '<b>' + eur(T.mois) + ' <small>/ mois</small></b><span>') + ', à partir d\'une date que l\'on fixe ensemble</span>';
      if(T.devis) h += '<span>' + (T.devis > 1 ? "Certains éléments sont" : "Un élément est") + ' chiffré' + (T.devis > 1 ? "s" : "") + ' après notre échange.</span>';
      h += '<span>TVA non applicable, art. 293 B du CGI.</span></div><div class="nav2"><button type="button" class="btn line" data-a="refaire">Modifier</button>' + (T.lignes.length ? '<button type="button" class="btn" data-a="devis">Recevoir le devis</button>' : '') + '</div>';
      dejaN = -1; avance(1, "Votre offre"); stage.innerHTML = h; stage.classList.remove("neuf"); void stage.offsetWidth; stage.classList.add("neuf");
    }
    function formulaire(){
      var T = totaux(), lien = lienAcompte(T.once), h = '<h3>Votre devis</h3><p class="sm">Il se génère tout de suite, avec les conditions de vente. Rien n\'est engagé tant que vous ne l\'acceptez pas.</p><form class="form" novalidate>';
      [["struct","Structure", D.nom, "organization"],["rep","Votre nom", "", "name"],["fonction","Votre fonction", cf.public ? "Maire, secrétaire de mairie…" : "Gérant, présidente…", "organization-title"],["adr","Adresse", "", "street-address"],["ville","Code postal et ville", "", "address-level2"],["mail","E-mail", "", "email"]].forEach(function(f){
        h += '<label><span>' + f[1] + '</span><input name="' + f[0] + '" autocomplete="' + f[3] + '"' + (f[0] === "mail" ? ' type="email" inputmode="email"' : '') + ' value="' + esc(client[f[0]] || (f[0] === "struct" ? D.nom : "")) + '" placeholder="' + esc(f[0] === "struct" ? "" : f[2]) + '" required></label>'; });
      h += '</form><p class="err" aria-live="polite"></p><div class="nav2"><button type="button" class="btn line" data-a="retour">Retour</button><button type="button" class="btn" data-a="pdf">Télécharger le devis</button></div>';
      if(cf.public){
        h += '<p class="sm">Ce devis peut servir de base à votre bon de commande. Pour la suite, choisissez un créneau : nous calons ensemble le démarrage et les modalités.</p><div class="nav2"><span></span><a class="btn" href="' + esc(rdv()) + '" target="_blank" rel="noopener">Choisir un créneau</a></div>';
      } else if(T.once && lien){
        h += '<div class="engage"><label class="accord"><input type="checkbox" name="ok"><span>J\'ai lu le devis n° ' + num + ' et ses conditions générales de vente, et je l\'accepte. Le paiement de l\'acompte vaut commande ferme.</span></label>' +
          '<button type="button" class="btn" data-a="payer" disabled>Payer l\'acompte de ' + eur(T.once * .3) + '</button><p class="sm">Paiement sécurisé par Stripe. Vous recevez le devis accepté, puis vous choisissez un créneau de 30 minutes pour lancer le projet.</p></div>';
      } else h += '<p class="sm">Pour la suite, choisissez un créneau : nous calons ensemble le démarrage.</p><div class="nav2"><span></span><a class="btn" href="' + esc(rdv()) + '" target="_blank" rel="noopener">Choisir un créneau</a></div>';
      dejaN = -1; avance(1, "Votre devis"); stage.innerHTML = h; stage.classList.remove("neuf"); void stage.offsetWidth; stage.classList.add("neuf");
    }
    function lire(){ var ok = true, f = box.querySelector("form"); Array.prototype.forEach.call(f.elements, function(x){ client[x.name] = x.value.trim(); if(!x.value.trim() || (x.name === "mail" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x.value.trim()))){ ok = false; x.setAttribute("aria-invalid","true"); } else x.removeAttribute("aria-invalid"); });
      box.querySelector(".err").textContent = ok ? "" : "Complétez les champs en rouge pour générer le devis."; return ok; }
    function lienAcompte(t){ var a = cf.acompte || {}, u = a[String(Math.round(t))]; return /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com)\//.test(u || "") ? u : ""; }
    function rdv(){ return (D.contact && /^https:\/\//.test(D.contact.rdv || "")) ? D.contact.rdv : "https://cal.eu/studioes/30min"; }
    function pdf(accepte){
      if(!window.jspdf || !window.studioDevis || !window.DEVIS_FONTS){ box.querySelector(".err").textContent = "Le devis n'a pas pu se charger. Rechargez la page avec une connexion active."; return null; }
      var out = window.studioDevis({nom:D.nom, objet:cf.objet, public:!!cf.public}, totaux().lignes, client, num, accepte ? {date:new Date().toISOString(), nom:client.rep} : null, cf.regles);
      var u = URL.createObjectURL(out.blob), a = document.createElement("a"); a.href = u; a.download = out.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); }, 60000);
      return out;
    }
    function charger(fn){ if(dejaTel || window.jspdf){ fn(); return; } dejaTel = true; var s = [["https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"],["../assets/devis-fonts.js"],["../assets/devis.js"]], k = 0;
      (function un(){ if(k >= s.length) return fn(); var x = document.createElement("script"); x.src = s[k++][0]; x.onload = un; x.onerror = function(){ fn(); }; document.head.appendChild(x); })(); }

    box.addEventListener("click", function(ev){
      var b = ev.target.closest("button"); if(!b || b.disabled || !box.contains(b)) return; var n = +box.dataset.n;
      if(b.dataset.k != null){ var k = +b.dataset.k, c = choix[n], o = etapes[n].options[k];
        if(o.obligatoire){ b.classList.remove("non"); void b.offsetWidth; b.classList.add("non"); return; }
        if(etapes[n].multi && !o.aucun){ c = c.filter(function(x){ return !etapes[n].options[x].aucun; }); var p = c.indexOf(k); if(p >= 0) c.splice(p, 1); else c.push(k); choix[n] = c; }
        else choix[n] = o.aucun ? [k].concat(c.filter(function(x){ return etapes[n].options[x].obligatoire; })) : [k]; return pas(); }
      var a = b.dataset.a;
      if(a === "suiv"){ i++; pas(); } else if(a === "prec"){ i--; pas(); } else if(a === "refaire"){ i = 0; pas(); }
      else if(a === "devis"){ formulaire(); charger(function(){}); }
      else if(a === "retour"){ i = etapesVisibles().length; recap(); }
      else if(a === "pdf"){ if(lire()) charger(function(){ pdf(false); }); }
      else if(a === "payer"){ if(!lire()) return; var T = totaux(), lien = lienAcompte(T.once); if(!lien) return;
        var u = lien + "?client_reference_id=" + encodeURIComponent((num + "_" + code()).replace(/[^A-Za-z0-9_-]/g, "")) + "&prefilled_email=" + encodeURIComponent(client.mail);
        var w = window.open(u, "_blank"); charger(function(){ pdf(true); }); if(!w) location.href = u; }
    });
    box.addEventListener("change", function(ev){ if(ev.target.name === "ok"){ var p = box.querySelector('[data-a="payer"]'); if(p) p.disabled = !ev.target.checked; } });
    pas();
  }

  /* ---------- outils de démonstration (collectivités) ---------- */
  var OUTILS = {
    demandes:{titre:"Demandes et interventions", sous:"Services techniques", etats:["À traiter","En cours","Fait"], defaut:[
      {t:"Lampadaire éteint", l:"Rue de la Mairie", s:"Voirie", e:0, d:"Signalé ce matin"},{t:"Banc cassé au terrain de jeux", l:"Parc du bourg", s:"Espaces verts", e:1, d:"Prévu jeudi"},
      {t:"Nid-de-poule", l:"Route de la gare", s:"Voirie", e:0, d:"Signalé hier"},{t:"Fuite au robinet des vestiaires", l:"Salle des sports", s:"Bâtiments", e:1, d:"Plombier mardi"},
      {t:"Haie à tailler", l:"Allée des écoles", s:"Espaces verts", e:2, d:"Fait le 8"},{t:"Panneau stop penché", l:"Carrefour de Kerlan", s:"Voirie", e:2, d:"Fait le 6"}]},
    projets:{titre:"Projets du mandat", sous:"Suivi des projets", defaut:[
      {t:"Rénovation de l'école", r:"Adjointe aux affaires scolaires", f:"Juin 2027", steps:[["Étude de faisabilité",1],["Choix de l'architecte",1],["Permis de construire",0],["Travaux",0],["Inauguration",0]]},
      {t:"Aire de jeux du bourg", r:"Services techniques", f:"Avril 2027", steps:[["Consultation des familles",1],["Devis",1],["Commande",1],["Installation",0]]},
      {t:"Nouveau site de la commune", r:"Secrétariat de mairie", f:"Mars 2027", steps:[["Cadrage",1],["Maquette",0],["Contenus",0],["Mise en ligne",0]]},
      {t:"Voie douce vers le collège", r:"Maire", f:"2028", steps:[["Étude",1],["Subventions",0],["Acquisitions",0],["Travaux",0]]}]},
    salles:{titre:"Réservation des salles", sous:"Salles municipales", jours:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"], defaut:[
      {t:"Salle des fêtes", r:{"Sam":"Mariage","Ven":"Loto du club","Mar":"Gym douce"}},{t:"Salle polyvalente", r:{"Lun":"Judo","Mer":"Danse","Jeu":"Judo"}},{t:"Salle du conseil", r:{"Mar":"Conseil municipal","Jeu":"Permanence"}},{t:"Maison des associations", r:{"Mer":"Club des aînés","Sam":"Assemblée générale"}}]},
    com:{titre:"Calendrier de communication", sous:"Planning éditorial", canaux:{site:"Site",fb:"Facebook",mag:"Bulletin",pan:"Panneau"}, defaut:[
      {sem:"Semaine 43", items:[{c:"fb", t:"Vacances : horaires de la médiathèque", ok:1},{c:"site", t:"Compte rendu du conseil municipal", ok:1},{c:"pan", t:"Collecte des encombrants", ok:0}]},
      {sem:"Semaine 44", items:[{c:"fb", t:"Photos de la commémoration", ok:0},{c:"site", t:"Inscriptions à la cantine", ok:0}]},
      {sem:"Semaine 45", items:[{c:"mag", t:"Bouclage du bulletin d'hiver", ok:0},{c:"fb", t:"Marché de Noël : appel aux exposants", ok:0},{c:"pan", t:"Travaux de voirie route de la gare", ok:0}]}]}
  };
  /* Démonstrations d'outils v2 : une vraie petite application, en version ordinateur ou téléphone,
     avec des compteurs qui bougent, des cartes qui changent de colonne et des confirmations. */
  var OIC = {demandes:"M4 6h16M4 12h10M4 18h7M18 15l2 2 3-4", projets:"M4 19V9M10 19V5M16 19v-7M22 19H2", salles:"M3 5h18v15H3zM3 10h18M8 3v4M16 3v4", com:"M4 11l14-6v14L4 13zM4 11v2M8 13.5V18h3"};
  var POOL = [{t:"Éclairage du parking", l:"Place de l'église", s:"Voirie"},{t:"Poubelle renversée", l:"Arrêt de car", s:"Propreté"},{t:"Porte du local qui ferme mal", l:"Salle des associations", s:"Bâtiments"},{t:"Branche tombée", l:"Chemin de randonnée", s:"Espaces verts"},{t:"Tag sur le mur", l:"Abri bus", s:"Propreté"}];
  function svgI(p){ return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + p + '"/></svg>'; }
  function demos(ots, D){
    var box = document.getElementById("odemo"); if(!box) return;
    var cur = 0, etat = ots.map(function(x){ return JSON.parse(JSON.stringify((x.exemples && x.exemples.length) ? x.exemples : OUTILS[x.type].defaut)); });
    var mode = window.matchMedia("(max-width:700px)").matches ? "tel" : "pc", filtre = -1, neuf = null, msg = "", pi = 0, kpiAvant = {};
    var acc = couleur(D.accent, "#2450B8"), nomC = D.nom || "Commune", ini = nomC.replace(/^(Commune|Mairie|Ville)\s+(de\s+|du\s+|d'|des\s+)?/i, "").replace(/^(Le|La|Les)\s+/i, "").charAt(0).toUpperCase();
    function kpis(x, E){
      if(x.type === "demandes"){ var n = [0,0,0]; E.forEach(function(r){ n[r.e]++; }); return [["À traiter", n[0], "e0"],["En cours", n[1], "e1"],["Faites", n[2], "e2"]]; }
      if(x.type === "projets"){ var t = 0, f = 0; E.forEach(function(p){ p.steps.forEach(function(s){ t++; if(s[1]) f++; }); }); return [["Projets", E.length, ""],["Avancement", Math.round(f / Math.max(1, t) * 100), "", " %"],["Étapes restantes", t - f, ""]]; }
      if(x.type === "salles"){ var J = OUTILS.salles.jours, pr = 0, tot = E.length * J.length; E.forEach(function(s){ pr += Object.keys(s.r || {}).length; }); return [["Réservations", pr, ""],["Créneaux libres", tot - pr, ""],["Occupation", Math.round(pr / Math.max(1, tot) * 100), "", " %"]]; }
      var a = 0, o = 0; E.forEach(function(w){ w.items.forEach(function(it){ a++; if(it.ok) o++; }); }); return [["Publications", a, ""],["Faites", o, "e2"],["À venir", a - o, "e1"]];
    }
    function action(x){ return {demandes:"Nouvelle demande", projets:"Voir le tableau du conseil", salles:"Réserver une salle", com:"Programmer une publication"}[x.type]; }
    function corps(x, E){
      var O = OUTILS[x.type], h = "";
      if(x.type === "demandes"){
        if(mode === "pc"){ h = '<div class="kb">' + O.etats.map(function(t, c){ return '<div class="col c' + c + '"><b>' + t + ' <i>' + E.filter(function(r){ return r.e === c; }).length + '</i></b>' + E.map(function(r, k){ if(r.e !== c) return ""; return '<button type="button" data-r="' + k + '" class="crd' + (neuf === k ? " neuf" : "") + '"><span class="tg">' + esc(r.s) + '</span><strong>' + esc(r.t) + '</strong><small>' + esc(r.l) + '</small><em>' + esc(r.d || "") + '</em></button>'; }).join("") + '</div>'; }).join("") + '</div>'; }
        else { var n = [0,0,0]; E.forEach(function(r){ n[r.e]++; }); h = '<div class="pl2">' + ['<button type="button" data-f="-1" aria-pressed="' + (filtre < 0) + '">Tout</button>'].concat(O.etats.map(function(t, k){ return '<button type="button" data-f="' + k + '" aria-pressed="' + (filtre === k) + '">' + t + ' ' + n[k] + '</button>'; })).join("") + '</div><div class="lst">' + E.map(function(r, k){ if(filtre >= 0 && r.e !== filtre) return ""; return '<button type="button" data-r="' + k + '" class="ln e' + r.e + (neuf === k ? " neuf" : "") + '"><span class="pt"></span><span class="tt"><strong>' + esc(r.t) + '</strong><small>' + esc(r.l) + ' · ' + esc(r.s) + '</small></span><span class="st">' + O.etats[r.e] + '</span></button>'; }).join("") + '</div>'; }
      } else if(x.type === "projets"){
        h = '<div class="pj">' + E.map(function(p, k){ var f = p.steps.filter(function(s){ return s[1]; }).length, pc = Math.round(f / p.steps.length * 100), C = 2 * Math.PI * 22, nx = p.steps.filter(function(s){ return !s[1]; })[0];
          return '<div class="pjc"><div class="ph"><svg class="rg" viewBox="0 0 56 56"><circle cx="28" cy="28" r="22"/><circle class="v" cx="28" cy="28" r="22" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - pc / 100)).toFixed(1) + '"/></svg><span class="pc">' + pc + '<small>%</small></span><span class="tt"><strong>' + esc(p.t) + '</strong><small>' + esc(p.r) + ' · ' + esc(p.f) + '</small></span></div><div class="stp">' + p.steps.map(function(s, j){ return '<button type="button" data-p="' + k + '" data-s="' + j + '" aria-pressed="' + !!s[1] + '"><i></i>' + esc(s[0]) + '</button>'; }).join("") + '</div><p class="nx">' + (nx ? "Prochaine étape : " + esc(nx[0]) : "Projet terminé") + '</p></div>'; }).join("") + '</div>';
      } else if(x.type === "salles"){
        var J = O.jours, jj = mode === "pc" ? J : J.slice(0, 5);
        h = '<div class="sl" style="--n:' + jj.length + '"><span></span>' + jj.map(function(j){ return '<b>' + j + '</b>'; }).join("") + E.map(function(s, k){ return '<em>' + esc(s.t) + '</em>' + jj.map(function(j){ var r = (s.r || {})[j]; return '<button type="button" data-sl="' + k + '" data-j="' + j + '" class="' + (r ? "pris" : "") + (neuf === k + j ? " neuf" : "") + '">' + (r ? '<span>' + esc(r) + '</span>' : '<i>+</i>') + '</button>'; }).join(""); }).join("") + '</div>';
      } else {
        h = '<div class="cl">' + E.map(function(w, k){ return '<div class="wk"><b>' + esc(w.sem) + '</b>' + w.items.map(function(it, j){ return '<button type="button" data-w="' + k + '" data-i="' + j + '" aria-pressed="' + !!it.ok + '"><span class="cn c-' + esc(it.c) + '">' + esc(O.canaux[it.c] || it.c) + '</span><span class="tt">' + esc(it.t) + '</span><i></i></button>'; }).join("") + '</div>'; }).join("") + '</div>';
      }
      return h;
    }
    function rendreD(){
      var x = ots[cur], E = etat[cur], O = OUTILS[x.type], K = kpis(x, E), cle = cur + ":";
      var nav = ots.map(function(o, k){ return '<button type="button" data-t="' + k + '" aria-current="' + (k === cur) + '">' + svgI(OIC[o.type]) + '<span>' + esc(o.titre || OUTILS[o.type].titre) + '</span></button>'; }).join("");
      var kp = '<div class="kp">' + K.map(function(q, i){ return '<div class="k ' + q[2] + '"><small>' + q[0] + '</small><b data-v="' + q[1] + '" data-de="' + (kpiAvant[cle + i] != null ? kpiAvant[cle + i] : 0) + '" data-s="' + (q[3] || "") + '">' + q[1] + (q[3] || "") + '</b></div>'; }).join("") + '</div>';
      K.forEach(function(q, i){ kpiAvant[cle + i] = q[1]; });
      var tete = '<div class="hd"><div><small>' + esc(x.sous || O.sous) + '</small><h4>' + esc(x.titre || O.titre) + '</h4></div><button type="button" class="cta" data-a="1">' + (mode === "pc" ? esc(action(x)) : "+") + '</button></div>';
      var toast = msg ? '<div class="tst">' + esc(msg) + '</div>' : "";
      var h = '<div class="seg2" role="group" aria-label="Affichage"><button type="button" data-m="pc" aria-pressed="' + (mode === "pc") + '">Ordinateur</button><button type="button" data-m="tel" aria-pressed="' + (mode === "tel") + '">Téléphone</button></div>';
      if(mode === "pc") h += '<div class="pcw"><div class="pcs" style="--a:' + acc + '"><div class="bar"><i></i><i></i><i></i><span>services.' + esc(String(D.ville || "commune").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")) + '.fr</span></div><div class="win"><aside><div class="lg"><span>' + esc(ini || "C") + '</span><b>' + esc(nomC) + '</b></div><nav>' + nav + '</nav><p class="who">Connecté : accueil de la mairie</p></aside><main>' + tete + kp + '<div class="bd">' + corps(x, E) + '</div>' + toast + '</main></div></div></div>';
      else h += '<div class="tlw"><div class="tls" style="--a:' + acc + '"><div class="isl"></div><div class="scr">' + tete + kp + '<div class="bd">' + corps(x, E) + '</div></div><nav>' + nav + '</nav>' + toast + '</div></div>';
      h += x.texte ? '<p class="otx">' + esc(x.texte) + '</p>' : '';
      box.innerHTML = h; ajuste(); compte(); neuf = null;
      if(msg){ var m0 = msg; setTimeout(function(){ if(msg === m0){ msg = ""; var t = box.querySelector(".tst"); if(t) t.classList.add("out"); } }, 2200); }
    }
    function compte(){ box.querySelectorAll(".kp b").forEach(function(b){ var v = +b.dataset.v, de = +b.dataset.de, s = b.dataset.s; if(de === v || matchMedia("(prefers-reduced-motion: reduce)").matches) return; var t0 = performance.now();
      (function pas(t){ var k = Math.min(1, (t - t0) / 600); b.textContent = Math.round(de + (v - de) * (1 - Math.pow(1 - k, 3))) + s; if(k < 1) requestAnimationFrame(pas); })(t0); }); }
    function ajuste(){ var w = box.querySelector(".pcw"), s = box.querySelector(".pcs"); if(!w || !s) return; var k = Math.min(1, w.clientWidth / 980); s.style.transform = "scale(" + k + ")"; w.style.height = Math.ceil(s.offsetHeight * k) + "px"; }
    window.addEventListener("resize", ajuste);
    var tabs = document.querySelector(".otabs"); if(tabs) tabs.remove();
    box.addEventListener("click", function(ev){ var b = ev.target.closest("button"); if(!b || !box.contains(b)) return; var x = ots[cur], E = etat[cur];
      if(b.dataset.m){ mode = b.dataset.m; filtre = -1; msg = ""; }
      else if(b.dataset.t != null){ cur = +b.dataset.t; filtre = -1; msg = ""; }
      else if(b.dataset.f != null){ filtre = +b.dataset.f; }
      else if(b.dataset.a){
        if(x.type === "demandes"){ var r = POOL[pi++ % POOL.length]; E.unshift({t:r.t, l:r.l, s:r.s, e:0, d:"Signalé à l'instant"}); neuf = 0; msg = "Demande enregistrée : les services techniques la voient tout de suite."; filtre = -1; }
        else if(x.type === "salles"){ var J = OUTILS.salles.jours; outer: for(var a = 0; a < E.length; a++) for(var j = 0; j < J.length; j++){ E[a].r = E[a].r || {}; if(!E[a].r[J[j]]){ E[a].r[J[j]] = "Réservé"; neuf = a + J[j]; msg = E[a].t + ", " + J[j] + " : réservé. Le demandeur reçoit sa confirmation."; break outer; } } }
        else if(x.type === "com"){ var w = E[E.length - 1]; w.items.push({c:"fb", t:"Nouvelle publication", ok:0}); msg = "Publication programmée en " + w.sem.toLowerCase() + "."; }
        else msg = "Le tableau se projette tel quel en conseil municipal.";
      }
      else if(b.dataset.r != null){ var q = E[+b.dataset.r]; q.e = (q.e + 1) % 3; q.d = ["Signalé à l'instant","Pris en charge aujourd'hui","Fait aujourd'hui"][q.e]; neuf = +b.dataset.r; msg = q.t + " : " + OUTILS.demandes.etats[q.e].toLowerCase() + "."; }
      else if(b.dataset.p != null){ var st = E[+b.dataset.p].steps[+b.dataset.s]; st[1] = st[1] ? 0 : 1; msg = st[1] ? "Étape validée : " + st[0] + "." : ""; }
      else if(b.dataset.sl != null){ var s2 = E[+b.dataset.sl]; s2.r = s2.r || {}; if(s2.r[b.dataset.j]){ delete s2.r[b.dataset.j]; msg = "Créneau libéré."; } else { s2.r[b.dataset.j] = "Réservé"; neuf = +b.dataset.sl + b.dataset.j; msg = s2.t + ", " + b.dataset.j + " : réservé."; } }
      else if(b.dataset.w != null){ var it = E[+b.dataset.w].items[+b.dataset.i]; it.ok = it.ok ? 0 : 1; msg = it.ok ? "Publié : " + it.t + "." : ""; }
      else return;
      rendreD(); });
    rendreD();
  }

  /* espaces insécables avant : ; ? ! » et après « */
  function typo(r){ var w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT), n;
    while((n = w.nextNode())){ var t = n.nodeValue, u = t.replace(/ ([:;?!»])/g, "\u00a0$1").replace(/« /g, "«\u00a0"); if(u !== t) n.nodeValue = u; } }
  function apparition(){
    document.documentElement.classList.add("js");
    var els = document.querySelectorAll(".rv, .gd, .rc, .ap");
    if(!("IntersectionObserver" in window)){ els.forEach(function(e){ e.classList.add("on"); }); }
    else { var io = new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add("on"); io.unobserve(x.target); } }); }, {rootMargin:"0px 0px -6% 0px", threshold:.06});
      els.forEach(function(e){ io.observe(e); }); }
    /* rangées de cartes : l'observateur tient compte du défilement horizontal, chaque carte entre quand elle devient visible */
    var hd = document.getElementById("hd"), tic = false;
    function etat(){ tic = false; if(hd) hd.classList.toggle("on", scrollY > 10); }
    addEventListener("scroll", function(){ if(!tic){ tic = true; requestAnimationFrame(etat); } }, {passive:true}); etat();
  }

  fetch("data.json", {cache:"no-cache"}).then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(rendre).catch(function(){
    document.getElementById("app").innerHTML = '<section class="cv2"><div class="w"><div class="hd2"><h1>Dossier introuvable.</h1><p class="acc">Écrivez à <a href="mailto:contact@studioes.fr">contact@studioes.fr</a>.</p></div></div></section>';
  });
})();
