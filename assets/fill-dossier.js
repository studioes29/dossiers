/* Dossiers de prospection Fill.
   Lit ./data.json (préparé pour une structure) et les formules publiques de fill.studioes.fr (window.TANDEM),
   qui restent la seule source des prix et des unités. Aucun prix privé n'apparaît ici. */
(function(){
  "use strict";
  var MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  var FILL = "https://fill.studioes.fr";
  var RDV = "https://cal.eu/studioes/30min";
  var app = document.getElementById("app");
  var reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function url(s){ s = String(s || ""); return /^https:\/\//i.test(s) ? s.replace(/["'()\\\s]/g, encodeURIComponent) : ""; }
  function mailOk(s){ return /^[^@\s"<>]+@[^@\s"<>]+\.[^@\s"<>]+$/.test(String(s || "")); }
  function nb(n){ return Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " "); }
  function dateFr(s){ var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ""); return m ? (+m[3] === 1 ? "1er" : +m[3]) + " " + MOIS[+m[2]-1] + " " + m[1] : ""; }
  function lettres(t){ var k = 0; return esc(t).split(" ").map(function(m){ return '<span class="m" style="--k:' + (k++) + '">' + m + '</span>'; }).join(" "); }
  function ar(){ return '<span class="ar"><svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>'; }
  function coche(){ return '<svg viewBox="0 0 18 18"><path d="M3.5 9.5l3.5 3.5 7.5-8"/></svg>'; }
  function lienExt(){ return '<svg viewBox="0 0 14 14"><path d="M5 2h7v7M12 2L4.5 9.5"/></svg>'; }
  var LOGO = '<svg viewBox="0 0 1376 720" role="img" aria-label="Fill"><g class="lg-fi"><path d="M100 700V262C100 158 168 90 274 90H300V214H282C246 214 224 236 224 274V700Z"/><rect x="18" y="330" width="282" height="104" rx="8"/><rect x="360" y="330" width="124" height="370" rx="8"/><circle cx="422" cy="178" r="72"/></g><g stroke-width="96"><path class="lg-l1" pathLength="1" d="M560 655C590 540 672 260 732 144C762 74 854 59 860 120C866 234 800 400 660 570C630 620 640 668 710 664C750 662 763 640 788 600"/><path class="lg-l2" pathLength="1" d="M788 600C818 540 900 260 960 144C990 74 1082 59 1088 120C1094 234 1028 400 888 570C858 620 868 668 938 664C1038 660 1088 615 1188 612C1258 610 1288 600 1318 575"/></g></svg>';

  /* Repli si fill.studioes.fr ne répond pas : mêmes valeurs que l'offre publiée le 27 octobre 2026. */
  var REPLI = {formules:[
    {id:"essentiel", nom:"Essentiel", prix:490, unites:10, court:"présence entretenue", mise_en_place:490, suivi:"Point de 30 minutes chaque trimestre", points:["Site et réseaux entretenus","Demandes courantes en 2 jours ouvrés","Un point de suivi par trimestre"]},
    {id:"regulier", nom:"Régulier", prix:990, unites:22, court:"présence chaque semaine", mise_en_place:990, suivi:"Point de 30 minutes chaque mois", points:["Site, réseaux et newsletter","Demandes courantes en 2 jours ouvrés","Un point de suivi par mois"]},
    {id:"soutenu", nom:"Soutenu", prix:1890, unites:45, court:"production soutenue", mise_en_place:990, suivi:"Point toutes les deux semaines", points:["Demandes courantes en 1 jour ouvré","Deux urgences par mois incluses","Un point toutes les deux semaines"]}],
    relais:{nom:"Relais", prix_semaine:690, unites_semaine:12, semaines_min:2, prix_mois:2490, promesse:"Le poste est vide, la communication continue.", points:["Démarrage en 10 jours ouvrés","Urgences sans majoration","Passation complète au retour"]},
    catalogue:[], unite_sup:55};
  var NOMS = {post:"Publication", actu:"Actualité du site", agenda:"Agenda en ligne", presse:"Communiqué de presse", news:"Newsletter", page:"Page du site", gabarit:"Visuel sur gabarit", affiche:"Affiche", flyer:"Flyer ou programme", bulletin:"Page de bulletin", photo:"Reportage photo", point:"Point de suivi", moder:"Suivi des commentaires"};

  function offre(){ var o = window.TANDEM && window.TANDEM.offre; return (o && o.formules && o.formules.length) ? o : REPLI; }
  function unitesDe(type, O){ var c = (O.catalogue || []).filter(function(x){ return x.id === type; })[0]; if(c) return c.u; return {post:1, actu:1, agenda:1, presse:2, news:3, page:3, gabarit:1, affiche:4, flyer:5, bulletin:2, photo:10, point:1, moder:4}[type] || 1; }
  function nomType(type, O){ var c = (O.catalogue || []).filter(function(x){ return x.id === type; })[0]; return NOMS[type] || (c && c.nom) || "Demande"; }

  function charger(){
    fetch("data.json", {cache:"no-store"}).then(function(r){ if(!r.ok) throw 0; return r.json(); })
      .then(function(d){ rendre(d); })
      .catch(function(){ app.innerHTML = '<div class="erreur"><h2>Ce dossier n’est plus disponible.</h2><p class="lead">Écrivez à <a href="mailto:contact@studioes.fr">contact@studioes.fr</a> ou retrouvez Fill sur <a href="' + FILL + '">fill.studioes.fr</a>.</p></div>'; });
  }

  function rendre(D){
    var O = offre();
    var coll = D.type !== "entreprise";
    var profil = coll ? "collectivite" : "entreprise";
    document.title = (D.nom || "Votre dossier") + " · Fill";
    var items = (D.mois && D.mois.items) || [];
    var total = items.reduce(function(a, x){ return a + unitesDe(x.type, O) * (x.n || 1); }, 0);
    var fid = D.formule || (total <= 10 ? "essentiel" : total <= 22 ? "regulier" : "soutenu");
    var F = fid === "relais" ? null : (O.formules.filter(function(x){ return x.id === fid; })[0] || O.formules[0]);
    var R = O.relais || REPLI.relais;
    var rdv = (D.contact && url(D.contact.rdv)) || RDV;
    var mail = (D.contact && mailOk(D.contact.mail)) ? D.contact.mail : "contact@studioes.fr";
    var k = 0, h = [];

    /* en-tête */
    h.push('<header class="hd" id="hd"><div class="w"><a class="lg" href="' + FILL + '" aria-label="Fill">' + LOGO + '</a><a class="bt sm" href="' + esc(rdv) + '" target="_blank" rel="noopener">Rendez-vous' + ar() + '</a></div><div class="hd-prog" aria-hidden="true"><i></i></div></header>');

    /* couverture */
    var rac = [["vu","Ce que nous avons vu"]];
    if(items.length) rac.push(["mois","Un mois avec Fill"]);
    rac.push(["formule", fid === "relais" ? "Relais" : "La formule"], ["echange","En parler"]);
    h.push('<section class="couv"><svg class="fil-fond" viewBox="0 0 900 700" aria-hidden="true"><path pathLength="1" d="M60 640C150 460 260 120 360 90C470 58 520 190 430 330C360 440 300 560 390 600C500 650 610 470 700 330C760 240 820 220 860 260"/></svg><div class="w">' +
      '<p class="pour"><i></i>Préparé pour ' + esc(D.nom) + '</p>' +
      '<h1>' + lettres(D.titre || "Votre communication,") + '<span class="it">' + (D.sousTitre ? esc(D.sousTitre) : 'sans perdre le <u>fil</u>.') + '</span></h1>' +
      '<p class="accroche rv">' + esc(D.accroche) + '</p>' +
      '<ul class="raccourcis rv" style="--k:1">' + rac.map(function(r, n){ return '<li><a href="#' + r[0] + '"><b>' + (n + 1) + '</b>' + esc(r[1]) + '</a></li>'; }).join("") + '</ul>' +
      '<p class="prepare rv" style="--k:2">Dossier préparé le ' + dateFr(D.date) + (D.ville ? ', pour ' + esc(D.ville) : '') + '.</p>' +
      '</div></section>');

    /* constats (et signal en tête) */
    var sig = "";
    if(D.signal && (D.signal.titre || D.signal.texte)){
      var icon = D.signal.type === "recrutement" ? '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/>' : '<path d="M12 3v10M12 17v.5"/><circle cx="12" cy="12" r="10"/>';
      sig = '<div class="signal rv"><span class="ico"><svg viewBox="0 0 24 24">' + icon + '</svg></span><div><b>' + esc(D.signal.titre) + '</b><p>' + esc(D.signal.texte) + '</p>' + (url(D.signal.lien) ? '<a class="src" href="' + esc(url(D.signal.lien)) + '" target="_blank" rel="noopener">Voir l’annonce</a>' : '') + '</div></div>';
    }
    h.push('<section class="fe sable" id="vu"><div class="w">' + sig + (sig ? '<div style="height:56px"></div>' : '') +
      '<h2 class="rv">Ce que nous avons vu<span class="it">en ligne, <u>sans rien demander</u>.</span></h2>' +
      '<p class="lead rv">' + esc(D.introConstats || (coll ? "La communication d’une commune se lit en grande partie en ligne : site, réseaux, bulletin, agenda. Voici ce qui ressort aujourd’hui." : "Votre communication se lit en grande partie en ligne. Voici ce qui ressort aujourd’hui.")) + '</p>' +
      '<div class="constats">' + (D.constats || []).map(function(c, n){
        var et = {bien:"Tenu", moyen:"À reprendre", absent:"Absent"}[c.etat] || "À reprendre";
        return '<article class="cs ' + esc(c.etat || "moyen") + ' rv" style="--k:' + n + '"><span class="et"><i></i>' + et + '</span><h3>' + esc(c.titre) + '</h3><p>' + esc(c.texte) + '</p>' + (url(c.lien) ? '<a class="voir" href="' + esc(url(c.lien)) + '" target="_blank" rel="noopener">Voir la page ' + lienExt() + '</a>' : '') + '</article>';
      }).join("") + '</div></div></section>');

    /* un mois avec Fill */
    if(items.length){
      h.push('<section class="fe lav" id="mois"><div class="w">' +
        '<h2 class="rv">Un mois avec Fill<span class="it">à partir de <u>votre actualité</u>.</span></h2>' +
        '<p class="lead rv">' + esc((D.mois && D.mois.intro) || "Un exemple construit avec ce qui est réellement annoncé chez vous. Chaque demande a sa valeur en unités, la même dans toutes les formules.") + '</p>' +
        '<div class="mois" id="moisL"><svg class="fil" aria-hidden="true"><defs><linearGradient id="gfil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8A4FF"/><stop offset="1" stop-color="#FF8A6B"/></linearGradient></defs><path class="base"/><path class="trace"/></svg>' +
        items.map(function(x, n){ var u = unitesDe(x.type, O) * (x.n || 1);
          return '<article class="it-m rv" style="--k:' + (n % 4) + '"><span class="ty">' + esc(nomType(x.type, O)) + (x.n > 1 ? ' × ' + x.n : '') + (x.semaine ? '<span class="sem">· semaine ' + esc(x.semaine) + '</span>' : '') + '</span><h3>' + esc(x.titre) + '</h3><span class="u">' + u + ' unité' + (u > 1 ? 's' : '') + '</span>' + (x.texte ? '<p>' + esc(x.texte) + '</p>' : '') + '</article>'; }).join("") +
        '</div>' +
        '<div class="bilan rv"><div class="ch"><b data-compte="' + total + '">' + total + '</b><span>unité' + (total > 1 ? 's' : '') + ' ce mois-ci' + (F ? ', sur les ' + F.unites + ' de la formule ' + esc(F.nom) : '') + '</span></div>' +
        (F ? '<div class="jauge" role="img" aria-label="' + total + ' unités sur ' + F.unites + '"><i data-ratio="' + Math.min(1, total / F.unites).toFixed(3) + '"></i></div>' : '') +
        '<p>' + esc((F && total > F.unites) ? "Ce mois dépasse le quota de " + (total - F.unites) + " unité" + (total - F.unites > 1 ? "s" : "") + " : elles sont proposées à " + (O.unite_sup || 55) + " € HT l’unité, ou reportées au mois suivant, toujours avec votre accord écrit." : (D.mois && D.mois.note) || "Les unités non utilisées se reportent sur le mois suivant. Rien n’est produit au-delà sans votre accord écrit.") + '</p></div>' +
        '</div></section>');
    }

    /* formule */
    var carte, cote;
    if(fid === "relais"){
      carte = '<div class="fo-c rv"><span class="rec">Pendant le recrutement</span><p class="nom">Relais</p><p class="court">' + esc(R.promesse || "Le poste est vide, la communication continue.") + '</p>' +
        '<div class="prix"><b>' + nb(R.prix_semaine) + '</b><sup>€</sup><span>HT par semaine, ' + (R.semaines_min || 2) + ' semaines minimum</span></div>' +
        '<ul>' + (R.points || []).map(function(p){ return '<li>' + coche() + esc(p) + '</li>'; }).join("") + '<li>' + coche() + (R.unites_semaine || 12) + ' unités par semaine</li></ul>' +
        (D.pourquoi ? '<p class="pq">' + esc(D.pourquoi) + '</p>' : '') +
        '<div class="bts"><a class="bt" href="' + esc(rdv) + '" target="_blank" rel="noopener">Prendre rendez-vous' + ar() + '</a><a class="bt clair" href="' + FILL + '/relais/" target="_blank" rel="noopener">Relais en détail' + ar() + '</a></div></div>';
      cote = '<div><div class="eng rv" style="--k:1"><div><b>' + nb(R.prix_mois || 2490) + ' €</b><span>HT par mois, au-delà d’un mois</span></div><div><b>10 jours</b><span>ouvrés pour démarrer</span></div></div>' +
        '<p class="note rv" style="--k:2">Si le poste reste ouvert ou n’est finalement pas pourvu, l’abonnement Régulier prend le relais à partir de ' + nb((O.formules[1] || REPLI.formules[1]).prix) + ' € HT par mois.</p></div>';
    } else {
      carte = '<div class="fo-c rv"><span class="rec">La formule qui vous correspond</span><p class="nom">' + esc(F.nom) + '</p><p class="court">' + esc(F.court || "") + '</p>' +
        '<div class="prix"><b>' + nb(F.prix) + '</b><sup>€</sup><span>HT par mois</span></div>' +
        '<ul><li>' + coche() + '<span><b>' + F.unites + ' unités</b> par mois</span></li>' + (F.points || []).map(function(p){ return '<li>' + coche() + esc(p) + '</li>'; }).join("") + '</ul>' +
        (D.pourquoi ? '<p class="pq">' + esc(D.pourquoi) + '</p>' : '') +
        '<div class="bts"><a class="bt" href="' + esc(rdv) + '" target="_blank" rel="noopener">Prendre rendez-vous' + ar() + '</a><a class="bt clair" href="' + FILL + '/simulateur/?profil=' + profil + '" target="_blank" rel="noopener">Ajuster dans le simulateur' + ar() + '</a></div></div>';
      cote = '<div><div class="eng rv" style="--k:1"><div><b>6 mois</b><span>Mise en place facturée une fois</span><em>' + nb(F.mise_en_place) + ' € HT</em></div><div><b>12 mois</b><span>Mise en place offerte</span><em>' + nb(F.mise_en_place) + ' € HT économisés</em></div></div>' +
        '<p class="note rv" style="--k:2">Ensuite, résiliable chaque mois avec un mois de préavis. Unité supplémentaire : ' + (O.unite_sup || 55) + ' € HT, jamais sans accord écrit. TVA non applicable, article 293 B du CGI.</p></div>';
    }
    h.push('<section class="fe blanc" id="formule"><div class="w"><h2 class="rv">' + (fid === "relais" ? 'Le poste attend,<span class="it">la <u>communication</u> continue.</span>' : 'Un prix fixe,<span class="it">chaque <u>mois</u>.</span>') + '</h2>' +
      '<p class="lead rv">' + (fid === "relais" ? "Le temps de recruter, puis de former la personne recrutée : publications, site, affiches et presse continuent, et la passation est préparée." : "Une seule adresse pour vos demandes, une épreuve à valider avant chaque publication, les fichiers sources qui restent à vous.") + '</p>' +
      '<div class="fo">' + carte + cote + '</div></div></section>');

    /* secteur public ou entreprise */
    var pts = coll ? [
      ["Neutralité et périodes électorales", "Les règles de communication des collectivités sont appliquées, y compris en période préélectorale."],
      ["Un achat simple", "Une année d’abonnement reste sous le seuil de dispense de procédure : pas d’appel d’offres à lancer."],
      ["Chorus Pro", "Facturation mensuelle déposée sur Chorus Pro, sans avance demandée."],
      ["Vos accès restent à vous", "Comptes, site et fichiers sources restent la propriété de la collectivité."]
    ] : [
      ["Un seul interlocuteur", "Les demandes arrivent à une adresse, chacune est confirmée sous 24 heures ouvrées."],
      ["Rien sans validation", "Une épreuve à relire avant chaque publication, deux allers-retours compris."],
      ["Un prix connu d’avance", "Un montant fixe chaque mois, aucune unité facturée sans accord écrit."],
      ["Vos accès restent à vous", "Comptes, site et fichiers sources restent votre propriété."]
    ];
    h.push('<section class="fe encre" id="cadre"><div class="w"><h2 class="rv">' + (coll ? 'Les règles du secteur public<span class="it">sont <u>prises en compte</u>.</span>' : 'Un cadre clair<span class="it">dès le <u>premier mois</u>.</span>') + '</h2>' +
      '<div class="pts">' + pts.map(function(p, n){ return '<div class="pt rv" style="--k:' + n + '"><i></i><b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></div>'; }).join("") + '</div></div></section>');

    /* fonctionnement */
    h.push('<section class="fe sable" id="fonctionnement"><div class="w"><h2 class="rv">Vous demandez,<span class="it">Fill s’occupe <u>du reste</u>.</span></h2>' +
      '<div class="etapes">' + [
        ["Vous demandez", "Quelques lignes et une photo, à une seule adresse. Pas de brief à rédiger.", "Confirmation sous 24 h ouvrées"],
        ["Fill produit", "La même annonce, mise en forme pour chaque canal.", "Courant : 1 à 2 jours ouvrés"],
        ["Vous validez", "Une épreuve à relire : rien ne part sans votre accord.", "Deux allers-retours compris"],
        ["C’est publié", "Sur vos canaux, ou en fichiers prêts à imprimer.", "Les fichiers sources vous restent"]
      ].map(function(e, n){ return '<div class="etp rv" style="--k:' + n + '"><b>' + e[0] + '</b><span>' + e[1] + '</span><em>' + e[2] + '</em></div>'; }).join("") + '</div></div></section>');

    /* questions */
    var faq = (D.faq || []).concat([
      {q:"Comment se passe le démarrage ?", r:"Un premier échange de 30 minutes, puis la mise en place : récupération des accès, gabarits à vos couleurs et calendrier du trimestre. Les premières publications partent dans les deux semaines."},
      {q:"Que se passe-t-il si un mois est plus chargé ?", r:"Les unités non utilisées se reportent sur le mois suivant. Au-delà du quota, rien n’est produit sans votre accord écrit."},
      {q:"Qui traite les demandes ?", r:"Ewen Soupault, qui pratique la communication territoriale depuis 2020. Vous avez un seul interlocuteur, du premier échange à la publication."}
    ]);
    h.push('<section class="fe blanc" id="questions"><div class="w"><h2 class="rv">Questions<span class="it">les plus <u>fréquentes</u>.</span></h2><div class="faq">' +
      faq.map(function(x, n){ return '<details class="rv" style="--k:' + (n % 4) + '"><summary>' + esc(x.q) + '<i aria-hidden="true"></i></summary><div class="r">' + esc(x.r) + '</div></details>'; }).join("") + '</div></div></section>');

    /* échange */
    h.push('<section class="fe encre" id="echange"><div class="w ech"><div><h2 class="rv">On en parle<span class="it"><u>quinze minutes</u> ?</span></h2>' +
      '<div class="qui rv" style="--k:1"><img src="' + FILL + '/assets/img/ewen-s.webp" alt="" width="64" height="64" loading="lazy"><p><b>Ewen Soupault</b> traite chaque demande. Fill est un service de Studio ES, en Bretagne.</p></div></div>' +
      '<div class="bts rv" style="--k:2"><a class="bt clair" href="' + esc(rdv) + '" target="_blank" rel="noopener">Prendre rendez-vous' + ar() + '</a><a class="bt clair" href="mailto:' + esc(mail) + '?subject=' + encodeURIComponent("Fill, " + (D.nom || "")) + '">Écrire un message' + ar() + '</a></div></div></section>');
    h.push('<footer class="pied"><div class="w"><span>Fill · un service <a href="https://studioes.fr">Studio ES</a> · TVA non applicable, art. 293 B du CGI</span><span><a href="' + FILL + '">fill.studioes.fr</a> · <a href="' + FILL + '/conditions/">Conditions</a></span></div></footer>');

    app.innerHTML = h.join("");
    typo(app);
    animer();
  }

  /* espaces insécables avant : ; ? ! » et après « */
  function typo(r){ var w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT), n, L = [];
    while((n = w.nextNode())) L.push(n);
    L.forEach(function(t){ t.nodeValue = t.nodeValue.replace(/ ([:;?!»])/g, " $1").replace(/« /g, "« ").replace(/(\d) (€|unités?|%)/g, "$1 $2"); }); }

  function animer(){
    var hd = document.getElementById("hd"), prog = hd.querySelector(".hd-prog i");
    var els = [].slice.call(document.querySelectorAll(".rv"));
    if(reduit || !("IntersectionObserver" in window)) els.forEach(function(e){ e.classList.add("vu"); });
    else { var io = new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add("vu"); io.unobserve(x.target); } }); }, {rootMargin:"0px 0px -8% 0px", threshold:.08}); els.forEach(function(e){ io.observe(e); }); }

    /* le fil du mois : un tracé ondulé qui suit la lecture et atteint chaque demande */
    var L = document.getElementById("moisL"), svg = L && L.querySelector(".fil"), base, trace, len = 0, its = L ? [].slice.call(L.querySelectorAll(".it-m")) : [];
    function dessiner(){ if(!L) return; var H = L.offsetHeight, d = "M18 0", y = 0, s = 1;
      while(y < H){ var y2 = Math.min(H, y + 90); d += " C" + (18 + 14 * s) + " " + (y + 30) + " " + (18 + 14 * s) + " " + (y2 - 30) + " 18 " + y2; y = y2; s = -s; }
      svg.setAttribute("viewBox", "0 0 36 " + H); svg.style.height = H + "px";
      base = svg.querySelector(".base"); trace = svg.querySelector(".trace"); base.setAttribute("d", d); trace.setAttribute("d", d);
      len = trace.getTotalLength(); trace.style.strokeDasharray = len; trace.style.strokeDashoffset = reduit ? 0 : len; }
    var jauge = document.querySelector(".jauge i"), compte = document.querySelector("[data-compte]"), jFait = false;
    function etat(){
      var y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
      hd.classList.toggle("on", y > 10);
      prog.style.transform = "scaleX(" + (H > 0 ? Math.min(1, y / H) : 0) + ")";
      if(L && len){ var r = L.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .62 - r.top) / r.height));
        if(!reduit) trace.style.strokeDashoffset = len * (1 - p);
        var lim = r.top + r.height * p;
        its.forEach(function(it){ it.classList.toggle("atteint", reduit || it.getBoundingClientRect().top + 30 <= lim); }); }
      if(jauge && !jFait){ var b = jauge.getBoundingClientRect(); if(b.top < innerHeight * .9){ jFait = true; requestAnimationFrame(function(){ jauge.style.transform = "scaleX(" + jauge.dataset.ratio + ")"; }); compter(); } }
    }
    function compter(){ if(!compte || reduit) return; var v = +compte.dataset.compte, t0 = performance.now();
      (function pas(t){ var k = Math.min(1, (t - t0) / 1100); compte.textContent = Math.round(v * (1 - Math.pow(1 - k, 3))); if(k < 1) requestAnimationFrame(pas); })(t0); }
    var tic = false;
    addEventListener("scroll", function(){ if(!tic){ tic = true; requestAnimationFrame(function(){ tic = false; etat(); }); } }, {passive:true});
    addEventListener("resize", function(){ dessiner(); etat(); });
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ dessiner(); etat(); });
    dessiner(); etat();
  }

  charger();
})();
