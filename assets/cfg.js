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
        h += '<div class="engage"><label class="accord"><input type="checkbox" name="ok"><span>J\'ai lu le devis n° ' + num + ' et ses <a href="https://studioes.fr/conditions/" target="_blank" rel="noopener">conditions générales de vente</a>, et je l\'accepte. Le paiement de l\'acompte vaut commande ferme.</span></label>' +
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

