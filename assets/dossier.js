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

  /* Trame des portails clients (comme le dossier de fin de projet Pierceval) : couverture alignée à gauche,
     sommaire numéroté, en-têtes de rubrique en deux colonnes, la maquette expliquée à gauche et montrée à droite. */
  function titreDeux(nom){ var m = /^(.*\S)\s+(\S+)$/.exec(String(nom || "")); return m ? esc(m[1]) + ' <span>' + esc(m[2]) + '</span>' : esc(nom); }
  function tete(n, titre, texte){ return '<div class="h2g"><div class="rv"><p class="kick">' + ("0" + n).slice(-2) + '</p><h2>' + esc(titre) + '</h2></div>' + (texte ? '<p class="rv">' + esc(texte) + '</p>' : '') + '</div>'; }
  function rendre(d){
    document.title = (d.nom || "Dossier") + " | Studio ES";
    var ct = d.contact || {}, rdv = url(ct.rdv) || "https://cal.eu/studioes/30min", mail = /^[^@\s]+@[^@\s]+$/.test(ct.mail || "") ? ct.mail : "contact@studioes.fr";
    var a = d.configurateur && (d.configurateur.etapes || []).length, ots = (d.outils || []).filter(function(x){ return OUTILS[x.type]; }).slice(0, 4);
    var S = [];
    if((d.constats || []).length) S.push({id:"constats", t:d.titreConstats || "Ce qu'on voit aujourd'hui"});
    if(d.maquette) S.push({id:"maquette", t:d.maquette.accroche || "Ce que ça pourrait donner"});
    if((d.pistes || []).length) S.push({id:"pistes", t:d.titrePistes || "Par où commencer"});
    if((d.poles || []).length) S.push({id:"poles", t:d.titrePoles || "Ce que je peux prendre en charge"});
    if(ots.length) S.push({id:"outils", t:d.titreOutils || "Des outils faits pour vos services"});
    if(a) S.push({id:"prix", t:"Combien pour votre projet ?"});
    S.push({id:"contact", t:d.titreFin || "On en parle ?"});
    var num = {}; S.forEach(function(s, k){ num[s.id] = k + 1; });
    var o = [];
    o.push('<section class="pl cover"><div class="in"><a class="sig" href="https://studioes.fr">' + LOGO + '<span><b>Studio ES</b><span>Graphisme, photographie, web</span></span></a>' +
      '<div class="cv"><p class="kick rv">Un dossier préparé pour vous</p><h1 class="rv">' + titreDeux(d.nom) + '</h1>' +
      (d.accroche ? '<p class="lede rv">' + esc(d.accroche) + '</p>' : '') +
      '<div class="row rv"><a class="btn" href="#' + (a ? "prix" : S[0].id) + '">' + (a ? "Voir les prix" : "Lire le dossier") + '</a><a class="btn line" href="' + rdv + '" target="_blank" rel="noopener">Choisir un créneau ↗</a></div>' +
      '<p class="meta rv">' + [d.secteur, d.ville, d.date ? "Préparé le " + dateFr(d.date) : ""].filter(Boolean).map(esc).join(" · ") + '</p></div></div></section>');

    if(S.length > 2) o.push(planche("cream", 0, '<h2 class="rv">Au sommaire</h2><nav class="som rv" aria-label="Sommaire">' + S.map(function(s){ return '<a href="#' + s.id + '">' + esc(s.t) + '</a>'; }).join("") + '</nav>'));

    if((d.constats || []).length){
      o.push(planche("", 2, tete(num.constats, S[num.constats - 1].t, d.texteConstats || "Ce que j'ai regardé avant de vous écrire : votre site, vos réseaux, ce que l'on trouve en vous cherchant.") + '<ul class="cons">' + d.constats.map(function(c){
        var n = ICONES[c.etat] ? c.etat : "moyen", lien = url(c.lien);
        return '<li class="rv"><span class="note ' + n + '" role="img" aria-label="' + ({bien:"Ce qui va bien",moyen:"À améliorer",absent:"Absent"})[n] + '"><svg viewBox="0 0 24 24">' + ICONES[n] + '</svg></span><h3>' + esc(c.titre) + '</h3><p>' + esc(c.texte) + (lien ? ' <a href="' + lien + '" target="_blank" rel="noopener">Voir ↗</a>' : '') + '</p></li>';
      }).join("") + '</ul>', "constats"));
    }

    if(d.maquette){
      var mq = maquette(d.maquette), mtel = typeof mq === "string" ? mq : mq.tel, mpc = typeof mq === "string" ? "" : mq.pc;
      var pts = (d.maquette.points || []).slice(0, 4);
      o.push(planche("cream", 1, '<div class="choix2"><div class="tx"><p class="kick rv">' + ("0" + num.maquette).slice(-2) + '</p><h2 class="rv">' + esc(S[num.maquette - 1].t) + '</h2>' +
        (d.maquette.explication ? '<p class="rv">' + esc(d.maquette.explication) + '</p>' : '') +
        (pts.length ? '<ul class="pq2 rv">' + pts.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>' : '') +
        '<p class="nt rv">' + esc(d.maquette.legende || "Une première piste, faite à partir de ce qui existe déjà. Elle se discute.") + '</p></div>' +
        '<div class="duo2 rv' + (mpc ? "" : " solo") + '">' + mpc + '<div class="dv">' + mtel + '</div></div></div>', "maquette"));
    }

    if((d.pistes || []).length){
      o.push(planche("ochre", 0, tete(num.pistes, S[num.pistes - 1].t, d.textePistes || "Trois façons de commencer, de la plus simple à la plus suivie. On peut s'arrêter à la première.") + '<ol class="pistes">' + d.pistes.slice(0, 3).map(function(p){
        return '<li class="rv">' + (p.palier ? '<em>' + esc(p.palier) + '</em>' : '') + '<h3>' + esc(p.titre) + '</h3><p>' + esc(p.texte) + '</p></li>';
      }).join("") + '</ol>', "pistes"));
    }

    if((d.poles || []).length){
      o.push(planche("", 2, tete(num.poles, S[num.poles - 1].t, d.textePoles || "") + '<div class="poles">' + d.poles.slice(0, 4).map(function(p, k){
        return '<div class="pole rv" style="--k:' + k + '"><h3>' + esc(p.titre) + '</h3>' + (p.texte ? '<p>' + esc(p.texte) + '</p>' : '') + '<ul>' + (p.items || []).slice(0, 6).map(function(x){ return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>';
      }).join("") + '</div>', "poles"));
    }

    if(ots.length){
      o.push(planche("cream", 1, tete(num.outils, S[num.outils - 1].t, d.texteOutils || "Quelques exemples, à essayer : ils fonctionnent. Chaque outil se construit avec les agents qui l'utiliseront, sur téléphone comme sur ordinateur.") +
        '<div class="otabs rv" role="tablist">' + ots.map(function(x, k){ return '<button type="button" role="tab" data-t="' + k + '" aria-selected="' + (k === 0) + '">' + esc(x.titre || OUTILS[x.type].titre) + '</button>'; }).join("") + '</div><div class="odemo rv" id="odemo"></div>', "outils"));
      d.__outils = ots;
    }

    if(a){
      o.push(planche("nuit", 0, tete(num.prix, S[num.prix - 1].t, d.configurateur.intro || "Composez votre offre : le prix s'affiche au fur et à mesure, et le devis se génère tout de suite.") + '<div class="cfg" id="cfg"></div>', "prix"));
    }

    o.push(planche("sapin fin", 1, tete(num.contact, S[num.contact - 1].t, d.texteFin || "Trente minutes au téléphone suffisent pour voir si ça vous correspond. Sans engagement.") + '<div class="row rv"><a class="btn" href="' + rdv + '" target="_blank" rel="noopener">Choisir un créneau ↗</a><a class="btn line" href="mailto:' + esc(mail) + '?subject=' + encodeURIComponent("Dossier " + (d.nom || "")) + '">Écrire</a></div><p class="sm rv">Ewen Soupault, Studio ES · <a href="https://studioes.fr">studioes.fr</a></p>', "contact"));
    document.getElementById("app").innerHTML = o.join("");
    if(a) configurateur(d.configurateur, d);
    if(d.__outils) demos(d.__outils, d);
    apparition();
  }

  /* ---------- configurateur : prix réels, devis PDF, acceptation, acompte ---------- */
  function configurateur(cf, D){
    var box = document.getElementById("cfg"); if(!box) return;
    var etapes = cf.etapes, choix = etapes.map(function(e){ return []; }), i = 0, client = {}, num = numero(), dejaTel = false;
    function numero(){ var t = new Date(), a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", s = ""; for(var k = 0; k < 4; k++) s += a.charAt(Math.floor(Math.random() * a.length)); return String(t.getFullYear()).slice(2) + ("0" + (t.getMonth() + 1)).slice(-2) + ("0" + t.getDate()).slice(-2) + "-" + s; }
    function visible(e, k){ var o = etapes[e].options[k]; if(!o.si) return true; var c = choix[o.si[0]]; return o.si[1].some(function(x){ return c.indexOf(x) >= 0; }); }
    function nettoyer(){ etapes.forEach(function(e, n){ choix[n] = choix[n].filter(function(k){ return visible(n, k); }); }); }
    function etapesVisibles(){ return etapes.map(function(e, n){ return n; }).filter(function(n){ return etapes[n].options.some(function(o, k){ return visible(n, k) && !o.aucun; }); }); }
    function lignes(){ var r = []; etapes.forEach(function(e, n){ choix[n].forEach(function(k){ var o = e.options[k]; if(o.aucun) return; r.push({n:(o.titreDevis || o.l) + (o.an ? ", par an" : ""), l:o.lignes || (o.d ? [o.d] : []), p:o.p || 0, mois:!!o.mois, min:o.min, devis:!!o.devis}); }); }); return r; }
    function totaux(){ var L = lignes(), a = 0, m = 0, dv = 0; L.forEach(function(x){ if(x.devis) dv++; else if(x.mois) m += x.p; else a += x.p; }); return {once:a, mois:m, devis:dv, lignes:L}; }
    function prix(o){ return o.aucun ? "" : o.devis ? "sur devis" : eur(o.p) + (o.mois ? " / mois" : o.an ? " / an" : ""); }
    function code(){ return choix.map(function(c){ return c.length ? c.join("") : "x"; }).join("-"); }

    function pas(){
      nettoyer(); var V = etapesVisibles(); if(i >= V.length) return recap();
      var n = V[i], e = etapes[n], h = '<div class="prog">' + V.map(function(_, k){ return '<i class="' + (k <= i ? "on" : "") + '"></i>'; }).join("") + '<i></i></div>';
      h += '<div class="q"><h3>' + esc(e.q) + '</h3>' + (e.aide ? '<p class="sm">' + esc(e.aide) + '</p>' : e.multi ? '<p class="sm">Plusieurs choix possibles.</p>' : '') + '</div><div class="opts">';
      e.options.forEach(function(o, k){ if(!visible(n, k)) return;
        h += '<button type="button" class="opt" data-k="' + k + '" aria-pressed="' + (choix[n].indexOf(k) >= 0) + '"><span class="ck"></span><b>' + esc(o.l) + '</b><span class="px">' + esc(prix(o)) + '</span>' + (o.d ? '<small>' + esc(o.d) + (o.min ? " Engagement de " + o.min + " mois minimum." : "") + '</small>' : '') + '</button>'; });
      h += '</div><div class="nav2">' + (i ? '<button type="button" class="btn line" data-a="prec">Retour</button>' : '<span></span>') + '<button type="button" class="btn" data-a="suiv"' + (choix[n].length ? '' : ' disabled') + '>' + (i === V.length - 1 ? "Voir mon offre" : "Suivant") + '</button></div>';
      box.innerHTML = h; box.dataset.n = n;
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
      box.innerHTML = h;
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
      box.innerHTML = h;
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
      var b = ev.target.closest("button"); if(!b || b.disabled) return; var n = +box.dataset.n;
      if(b.dataset.k != null){ var k = +b.dataset.k, c = choix[n], o = etapes[n].options[k];
        if(etapes[n].multi && !o.aucun){ c = c.filter(function(x){ return !etapes[n].options[x].aucun; }); var p = c.indexOf(k); if(p >= 0) c.splice(p, 1); else c.push(k); choix[n] = c; }
        else choix[n] = [k]; return pas(); }
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
  function demos(ots, D){
    var box = document.getElementById("odemo"), tabs = document.querySelector(".otabs"); if(!box) return; var cur = 0, etat = ots.map(function(x){ return JSON.parse(JSON.stringify((x.exemples && x.exemples.length) ? x.exemples : OUTILS[x.type].defaut)); }), filtre = -1;
    function cadre(x, corps, outilsBarre){ var O = OUTILS[x.type];
      return '<div class="app"><div class="abar"><i></i><i></i><i></i><span>' + esc((D.nom || "Commune") + " · " + (x.titre || O.titre)) + '</span></div><div class="ahead"><div><small>' + esc(x.sous || O.sous) + '</small><b>' + esc(x.titre || O.titre) + '</b></div>' + (outilsBarre || "") + '</div><div class="abody">' + corps + '</div></div>' + (x.texte ? '<p class="otx">' + esc(x.texte) + '</p>' : ''); }
    function rendre(){
      var x = ots[cur], E = etat[cur], O = OUTILS[x.type], h = "";
      if(x.type === "demandes"){
        var n = [0,0,0]; E.forEach(function(r){ n[r.e]++; });
        var barre = '<div class="pills">' + ['<button type="button" data-f="-1" aria-pressed="' + (filtre < 0) + '">Tout ' + E.length + '</button>'].concat(O.etats.map(function(t, k){ return '<button type="button" data-f="' + k + '" aria-pressed="' + (filtre === k) + '">' + t + ' ' + n[k] + '</button>'; })).join("") + '</div>';
        h = '<ul class="dem">' + E.map(function(r, k){ if(filtre >= 0 && r.e !== filtre) return ""; return '<li><button type="button" data-r="' + k + '" class="e' + r.e + '"><span class="pt"></span><span class="tt"><b>' + esc(r.t) + '</b><small>' + esc(r.l) + ' · ' + esc(r.s) + '</small></span><span class="st">' + O.etats[r.e] + '<small>' + esc(r.d || "") + '</small></span></button></li>'; }).join("") + '</ul><p class="astuce">Touchez une demande pour la faire avancer.</p>';
        h = cadre(x, h, barre);
      } else if(x.type === "projets"){
        h = '<ul class="prj">' + E.map(function(p, k){ var f = p.steps.filter(function(s){ return s[1]; }).length, pc = Math.round(f / p.steps.length * 100), nx = p.steps.filter(function(s){ return !s[1]; })[0];
          return '<li><details' + (k === 0 ? " open" : "") + '><summary><span class="tt"><b>' + esc(p.t) + '</b><small>' + esc(p.r) + ' · ' + esc(p.f) + '</small></span><span class="pct">' + pc + ' %</span><span class="jauge"><i style="width:' + pc + '%"></i></span><small class="nx">' + (nx ? "Prochaine étape : " + esc(nx[0]) : "Terminé") + '</small></summary><ol>' + p.steps.map(function(s, j){ return '<li><button type="button" data-p="' + k + '" data-s="' + j + '" aria-pressed="' + !!s[1] + '"><span class="ck"></span>' + esc(s[0]) + '</button></li>'; }).join("") + '</ol></details></li>'; }).join("") + '</ul>';
        h = cadre(x, h, '<span class="kpi">' + E.length + ' projets</span>');
      } else if(x.type === "salles"){
        var J = O.jours; h = '<div class="sal"><div class="sg" style="--n:' + J.length + '"><span></span>' + J.map(function(j){ return '<b>' + j + '</b>'; }).join("") +
          E.map(function(s, k){ return '<em>' + esc(s.t) + '</em>' + J.map(function(j){ var r = (s.r || {})[j]; return '<button type="button" data-sl="' + k + '" data-j="' + j + '" class="' + (r ? "pris" : "") + '" aria-label="' + esc(s.t + ", " + j + (r ? ", " + r : ", libre")) + '">' + (r ? esc(r) : "") + '</button>'; }).join(""); }).join("") + '</div></div><p class="astuce">Touchez un créneau libre pour le réserver.</p>';
        h = cadre(x, h, '<span class="kpi">Semaine en cours</span>');
      } else if(x.type === "com"){
        h = '<div class="cal">' + E.map(function(w, k){ return '<div class="sem"><b>' + esc(w.sem) + '</b><ul>' + w.items.map(function(it, j){ return '<li><button type="button" data-w="' + k + '" data-i="' + j + '" aria-pressed="' + !!it.ok + '"><span class="cn c-' + esc(it.c) + '">' + esc(O.canaux[it.c] || it.c) + '</span><span class="tt">' + esc(it.t) + '</span><span class="ck"></span></button></li>'; }).join("") + '</ul></div>'; }).join("") + '</div><p class="astuce">Touchez une publication pour la marquer comme faite.</p>';
        var tot = 0, ok = 0; E.forEach(function(w){ w.items.forEach(function(it){ tot++; if(it.ok) ok++; }); });
        h = cadre(x, h, '<span class="kpi">' + ok + ' / ' + tot + ' publiés</span>');
      }
      box.innerHTML = h;
    }
    tabs.addEventListener("click", function(ev){ var b = ev.target.closest("button[data-t]"); if(!b) return; cur = +b.dataset.t; filtre = -1; Array.prototype.forEach.call(tabs.children, function(x){ x.setAttribute("aria-selected", String(x === b)); }); rendre(); });
    box.addEventListener("click", function(ev){ var b = ev.target.closest("button"); if(!b) return; var E = etat[cur];
      if(b.dataset.f != null){ filtre = +b.dataset.f; }
      else if(b.dataset.r != null){ var r = E[+b.dataset.r]; r.e = (r.e + 1) % 3; r.d = ["Signalé à l'instant","Pris en charge","Fait aujourd'hui"][r.e]; }
      else if(b.dataset.p != null){ var st = E[+b.dataset.p].steps[+b.dataset.s]; st[1] = st[1] ? 0 : 1; rendre(); var dd = box.querySelectorAll(".prj details")[+b.dataset.p]; if(dd) dd.open = true; return; }
      else if(b.dataset.sl != null){ var s = E[+b.dataset.sl]; s.r = s.r || {}; if(s.r[b.dataset.j]) delete s.r[b.dataset.j]; else s.r[b.dataset.j] = "Réservé"; }
      else if(b.dataset.w != null){ var it = E[+b.dataset.w].items[+b.dataset.i]; it.ok = it.ok ? 0 : 1; }
      else return; rendre(); });
    rendre();
  }

  function apparition(){
    document.documentElement.classList.add("js");
    var els = document.querySelectorAll(".rv");
    if(!("IntersectionObserver" in window)){ els.forEach(function(e){ e.classList.add("on"); }); return; }
    var io = new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add("on"); io.unobserve(x.target); } }); }, {rootMargin:"0px 0px -8% 0px"});
    els.forEach(function(e){ io.observe(e); });
  }

  fetch("data.json", {cache:"no-cache"}).then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(rendre).catch(function(){
    document.getElementById("app").innerHTML = '<section class="pl cover"><div class="in"><h2>Dossier introuvable.</h2><p class="lede">Écrivez à <a href="mailto:contact@studioes.fr">contact@studioes.fr</a>.</p></div></section>';
  });
})();
