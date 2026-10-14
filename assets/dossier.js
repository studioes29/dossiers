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
  function planche(cls, edge, inner){ return '<section class="pl ' + cls + '">' + (edge != null ? '<svg class="edge" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true"><path d="' + EDGES[edge] + '"/></svg>' : '') + '<div class="in">' + inner + '</div></section>'; }
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
    var image = url(m.image);
    return '<div class="ecran" style="' + style + '"><div class="nav"><b>' + esc(m.logoTexte || m.titre) + '</b><i></i></div><div class="hero"' + (image ? ' style="background-image:url(' + image + ')"' : "") + '>' + (!image && m.imageTexte ? '<p class="ph">' + esc(m.imageTexte) + '</p>' : "") + '<h4>' + esc(m.titre) + '</h4>' + (m.sousTitre ? '<p>' + esc(m.sousTitre) + '</p>' : "") + (m.bouton ? '<span class="cta">' + esc(m.bouton) + '</span>' : "") + '</div><div class="blocs">' + (m.menu || []).slice(0, 4).map(function(x){ return '<div>' + esc(x) + '</div>'; }).join("") + '</div><p class="pied">' + esc(m.pied || "") + '</p></div>';
  }

  function rendre(d){
    document.title = "Pour " + (d.nom || "vous") + " | Studio ES";
    var o = [];
    o.push('<section class="pl cover"><div class="in"><a class="sig" href="https://studioes.fr">' + LOGO + '<span><b>Studio ES</b><span>Studio ES, photographe et graphiste</span></span></a>' +
      '<h1 class="rv">Pour<span>' + esc(d.nom) + '</span></h1>' +
      (d.accroche ? '<p class="lede rv">' + esc(d.accroche) + '</p>' : '') +
      '<p class="meta rv">' + [d.secteur, d.ville, d.date ? "Préparé le " + dateFr(d.date) : ""].filter(Boolean).map(esc).join(" · ") + '</p></div></section>');

    if((d.constats || []).length){
      o.push(planche("cream", 0, '<h2 class="rv">' + esc(d.titreConstats || "Ce qu'on voit aujourd'hui") + '</h2><ul class="cons">' + d.constats.map(function(c){
        var n = ICONES[c.etat] ? c.etat : "moyen", lien = url(c.lien);
        return '<li class="rv"><span class="note ' + n + '" role="img" aria-label="' + ({bien:"Ce qui va bien",moyen:"À améliorer",absent:"Absent"})[n] + '"><svg viewBox="0 0 24 24">' + ICONES[n] + '</svg></span><h3>' + esc(c.titre) + '</h3><p>' + esc(c.texte) + (lien ? ' <a href="' + lien + '" target="_blank" rel="noopener">Voir</a>' : '') + '</p></li>';
      }).join("") + '</ul>'));
    }

    if(d.maquette){
      o.push(planche("", 1, '<div class="mq"><div class="tx"><h2 class="rv">' + esc(d.maquette.accroche || "Ce que ça pourrait donner") + '</h2><p class="lede rv">' + esc(d.maquette.explication || "") + '</p></div><div class="rv"><div class="vf"><i></i><i></i><i></i><i></i><div class="dv">' + maquette(d.maquette) + '</div></div><p class="cap">' + esc(d.maquette.legende || "Une première piste, faite à partir de ce qui existe déjà. Elle se discute.") + '</p></div></div>'));
    }

    if((d.pistes || []).length){
      o.push(planche("ochre", 2, '<h2 class="rv">' + esc(d.titrePistes || "Par où commencer") + '</h2><ol class="pistes">' + d.pistes.slice(0, 3).map(function(p){
        return '<li class="rv"><h3>' + esc(p.titre) + '</h3>' + (p.palier ? '<em>' + esc(p.palier) + '</em>' : '') + '<p>' + esc(p.texte) + '</p></li>';
      }).join("") + '</ol>'));
    }

    if(d.configurateur && (d.configurateur.etapes || []).length){
      o.push(planche("nuit", 0, '<h2 class="rv">Combien pour votre projet ?</h2><p class="lede rv">' + esc(d.configurateur.intro || "Choisissez ce qui vous intéresse : vous obtenez une fourchette tout de suite, le devis précis vient après un échange.") + '</p><div class="cfg" id="cfg"></div>'));
    }

    var ct = d.contact || {}, rdv = url(ct.rdv) || "https://cal.eu/studioes/30min", mail = /^[^@\s]+@[^@\s]+$/.test(ct.mail || "") ? ct.mail : "contact@studioes.fr";
    o.push(planche("sapin fin", 1, '<h2 class="rv">' + esc(d.titreFin || "On en parle ?") + '</h2><p class="lede rv">' + esc(d.texteFin || "Trente minutes au téléphone suffisent pour voir si ça vous correspond. Sans engagement.") + '</p><div class="row rv"><a class="btn" href="' + rdv + '" target="_blank" rel="noopener">Choisir un créneau</a><a class="btn line" href="mailto:' + esc(mail) + '?subject=' + encodeURIComponent("Dossier " + (d.nom || "")) + '">Écrire</a></div><p class="sm rv">Ewen Soupault, Studio ES · <a href="https://studioes.fr">studioes.fr</a></p>'));
    o.push('<p class="pied">Ce dossier a été préparé pour ' + esc(d.nom) + ' uniquement.</p>');
    document.getElementById("app").innerHTML = o.join("");
    if(d.configurateur) configurateur(d.configurateur);
    apparition();
  }

  function configurateur(cf){
    var box = document.getElementById("cfg"); if(!box) return;
    var etapes = cf.etapes, choix = etapes.map(function(){ return []; }), i = 0;
    function opt(e, k){ return etapes[e].options[k]; }
    function pas(){
      if(i >= etapes.length) return recap();
      var e = etapes[i], h = '<div class="prog">' + etapes.map(function(_, k){ return '<i class="' + (k <= i ? "on" : "") + '"></i>'; }).join("") + '<i></i></div>';
      h += '<div class="q"><h3>' + esc(e.q) + '</h3>' + (e.multi ? '<p class="sm">Plusieurs choix possibles.</p>' : '') + '</div><div class="opts">';
      e.options.forEach(function(op, k){
        var px = op.devis ? "sur devis" : op.min == null || (op.min === 0 && !op.max) ? "" : plage(op.min, op.max == null ? op.min : op.max) + (op.mois ? " / mois" : "");
        h += '<button type="button" class="opt" data-k="' + k + '" aria-pressed="' + (choix[i].indexOf(k) >= 0) + '"><span class="ck"></span><b>' + esc(op.l) + '</b><span class="px">' + esc(px) + '</span>' + (op.d ? '<small>' + esc(op.d) + '</small>' : '') + '</button>';
      });
      h += '</div><div class="nav2">' + (i ? '<button type="button" class="btn line" data-a="prec">Retour</button>' : '<span></span>') + '<button type="button" class="btn" data-a="suiv"' + (choix[i].length ? '' : ' disabled style="opacity:.4"') + '>' + (i === etapes.length - 1 ? "Voir l'estimation" : "Suivant") + '</button></div>';
      box.innerHTML = h;
    }
    function recap(){
      var a = 0, b = 0, ma = 0, mb = 0, dv = [], lignes = [];
      etapes.forEach(function(e, n){ choix[n].forEach(function(k){ var op = opt(n, k), lo = op.min || 0, hi = op.max == null ? lo : op.max;
        if(op.devis){ dv.push(op.l); lignes.push('<li><span>' + esc(op.l) + '</span><span>sur devis</span></li>'); return; }
        if(!lo && !hi) return;
        if(op.mois){ ma += lo; mb += hi; } else { a += lo; b += hi; } lignes.push('<li><span>' + esc(op.l) + '</span><span>' + plage(lo, hi) + (op.mois ? " / mois" : "") + '</span></li>'); }); });
      if(!lignes.length) lignes.push('<li><span>Rien de sélectionné pour l\'instant</span><span></span></li>');
      var big = a || b ? plage(a, b) : ma || mb ? plage(ma, mb) + " / mois" : "Sur devis";
      var sous = [a || b ? (ma || mb ? "puis " + plage(ma, mb) + " par mois" : "en une fois") : "", dv.length && (a || b || ma || mb) ? "+ " + dv.join(", ").toLowerCase() + " sur devis" : ""].filter(Boolean).join(", ");
      var t = '<div class="total"><b>' + big + '</b><span>' + esc(sous) + '</span><span>' + esc(cf.mention || "Fourchette indicative, hors frais de déplacement au-delà de 50 km. Le devis précis suit notre échange.") + '</span></div>';
      box.innerHTML = '<h3>Votre sélection</h3><ul class="recap">' + lignes.join("") + '</ul>' + t + '<div class="nav2"><button type="button" class="btn line" data-a="refaire">Modifier</button><a class="btn" href="#rdv-fin">En parler</a></div>';
      var f = document.querySelector(".fin"); if(f) f.id = "rdv-fin";
    }
    box.addEventListener("click", function(ev){
      var b = ev.target.closest("button"); if(!b) return;
      if(b.dataset.k != null){ var k = +b.dataset.k, c = choix[i]; if(etapes[i].multi){ var p = c.indexOf(k); if(p >= 0) c.splice(p, 1); else c.push(k); } else choix[i] = [k]; return pas(); }
      if(b.dataset.a === "suiv" && choix[i].length){ i++; pas(); }
      else if(b.dataset.a === "prec"){ i--; pas(); }
      else if(b.dataset.a === "refaire"){ i = 0; pas(); }
    });
    pas();
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
