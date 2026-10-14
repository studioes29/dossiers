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
      o.push(planche("nuit", 0, '<h2 class="rv">Combien pour votre projet ?</h2><p class="lede rv">' + esc(d.configurateur.intro || "Composez votre offre : le prix s'affiche au fur et à mesure, et le devis se génère tout de suite.") + '</p><div class="cfg" id="cfg"></div>'));
    }

    var ct = d.contact || {}, rdv = url(ct.rdv) || "https://cal.eu/studioes/30min", mail = /^[^@\s]+@[^@\s]+$/.test(ct.mail || "") ? ct.mail : "contact@studioes.fr";
    o.push(planche("sapin fin", 1, '<h2 class="rv">' + esc(d.titreFin || "On en parle ?") + '</h2><p class="lede rv">' + esc(d.texteFin || "Trente minutes au téléphone suffisent pour voir si ça vous correspond. Sans engagement.") + '</p><div class="row rv"><a class="btn" href="' + rdv + '" target="_blank" rel="noopener">Choisir un créneau</a><a class="btn line" href="mailto:' + esc(mail) + '?subject=' + encodeURIComponent("Dossier " + (d.nom || "")) + '">Écrire</a></div><p class="sm rv">Ewen Soupault, Studio ES · <a href="https://studioes.fr">studioes.fr</a></p>'));
    o.push('<p class="pied">Ce dossier a été préparé pour ' + esc(d.nom) + ' uniquement.</p>');
    document.getElementById("app").innerHTML = o.join("");
    if(d.configurateur) configurateur(d.configurateur, d);
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
    function lignes(){ var r = []; etapes.forEach(function(e, n){ choix[n].forEach(function(k){ var o = e.options[k]; if(o.aucun) return; r.push({n:o.titreDevis || o.l, l:o.lignes || (o.d ? [o.d] : []), p:o.p || 0, mois:!!o.mois, min:o.min, devis:!!o.devis}); }); }); return r; }
    function totaux(){ var L = lignes(), a = 0, m = 0, dv = 0; L.forEach(function(x){ if(x.devis) dv++; else if(x.mois) m += x.p; else a += x.p; }); return {once:a, mois:m, devis:dv, lignes:L}; }
    function prix(o){ return o.aucun ? "" : o.devis ? "sur devis" : eur(o.p) + (o.mois ? " / mois" : ""); }
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
      if(T.once){ h += '<b>' + eur(T.once) + '</b><span>en une fois, dont un acompte de ' + eur(T.once * .3) + ' à la commande</span>'; }
      if(T.mois) h += (T.once ? '<span class="plus">+ ' + eur(T.mois) + ' par mois' : '<b>' + eur(T.mois) + ' <small>/ mois</small></b><span>') + ', à partir d\'une date que l\'on fixe ensemble</span>';
      if(T.devis) h += '<span>' + (T.devis > 1 ? "Certains éléments sont" : "Un élément est") + ' chiffré' + (T.devis > 1 ? "s" : "") + ' après notre échange.</span>';
      h += '<span>TVA non applicable, art. 293 B du CGI.</span></div><div class="nav2"><button type="button" class="btn line" data-a="refaire">Modifier</button>' + (T.lignes.length ? '<button type="button" class="btn" data-a="devis">Recevoir le devis</button>' : '') + '</div>';
      box.innerHTML = h;
    }
    function formulaire(){
      var T = totaux(), lien = lienAcompte(T.once), h = '<h3>Votre devis</h3><p class="sm">Il se génère tout de suite, avec les conditions de vente. Rien n\'est engagé tant que vous ne l\'acceptez pas.</p><form class="form" novalidate>';
      [["struct","Structure", D.nom, "organization"],["rep","Votre nom", "", "name"],["fonction","Votre fonction", "Gérant, présidente…", "organization-title"],["adr","Adresse", "", "street-address"],["ville","Code postal et ville", "", "address-level2"],["mail","E-mail", "", "email"]].forEach(function(f){
        h += '<label><span>' + f[1] + '</span><input name="' + f[0] + '" autocomplete="' + f[3] + '"' + (f[0] === "mail" ? ' type="email" inputmode="email"' : '') + ' value="' + esc(client[f[0]] || (f[0] === "struct" ? D.nom : "")) + '" placeholder="' + esc(f[0] === "struct" ? "" : f[2]) + '" required></label>'; });
      h += '</form><p class="err" aria-live="polite"></p><div class="nav2"><button type="button" class="btn line" data-a="retour">Retour</button><button type="button" class="btn" data-a="pdf">Télécharger le devis</button></div>';
      if(T.once && lien){
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
      var out = window.studioDevis({nom:D.nom, objet:cf.objet}, totaux().lignes, client, num, accepte ? {date:new Date().toISOString(), nom:client.rep} : null, cf.regles);
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
