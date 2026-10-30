/* Bon de commande signé en ligne (Studio ES et Fill).
   Lit data.json dans le dossier de la page. La signature est un consentement en ligne horodaté
   (nom, fonction, case « Lu et approuvé »), transmis à Studio ES avec l'empreinte du texte signé ;
   le client garde son exemplaire en PDF. Rien n'est enregistré sur un serveur tiers en dehors de l'envoi du formulaire. */
(function(){
  "use strict";
  var app = document.getElementById("app");
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }
  function eur(n){ n = Number(n) || 0; return n.toLocaleString("fr-FR", {minimumFractionDigits:n % 1 ? 2 : 0, maximumFractionDigits:2}).replace(/[  ]/g, " ") + " €"; }
  function dateFr(iso){ var d = iso ? new Date(iso) : new Date(); return d.toLocaleDateString("fr-FR", {day:"numeric", month:"long", year:"numeric"}); }
  function heureFr(iso){ var d = new Date(iso); return d.toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"}).replace(":", " h "); }
  function cle(D){ return "commande-" + (D.ref || location.pathname); }
  function lire(){ try{ return JSON.parse(localStorage.getItem(cle(D)) || "null"); }catch(e){ return null; } }
  function garder(v){ try{ localStorage.setItem(cle(D), JSON.stringify(v)); }catch(e){} }
  var D = null;
  /* bon de commande chiffré : data.json est une enveloppe AES-GCM, la clé suit le #k= du lien envoyé */
  var CLE = (/[#&]k=([A-Za-z0-9_-]{16,})/.exec(location.hash) || [])[1] || "";
  function b64(s){ s = s.replace(/-/g, "+").replace(/_/g, "/"); while(s.length % 4) s += "="; var t = atob(s), a = new Uint8Array(t.length); for(var i = 0; i < t.length; i++) a[i] = t.charCodeAt(i); return a; }
  function ouvrir(u){ return fetch(u, {cache:"no-cache"}).then(function(r){ if(!r.ok) throw new Error("absent"); return r.json(); }).then(function(j){
    if(!j || !j.enc) return j;
    if(!CLE || !(window.crypto && crypto.subtle)) throw new Error("cle");
    return crypto.subtle.importKey("raw", b64(CLE), "AES-GCM", false, ["decrypt"]).then(function(k){ return crypto.subtle.decrypt({name:"AES-GCM", iv:b64(j.iv)}, k, b64(j.ct)); })
      .then(function(p){ return JSON.parse(new TextDecoder().decode(p)); }, function(){ throw new Error("cle"); }); }); }

  ouvrir("data.json").then(function(x){ D = x; rendre(); }, function(e){
    app.innerHTML = '<div class="w"><header><div class="marque">Studio ES</div><h1>' + (e && e.message === "cle" ? "Lien incomplet." : "Ce bon de commande n’est pas disponible.") + '</h1></header><p>' + (e && e.message === "cle" ? "Lien incomplet : utilisez le lien reçu par e-mail." : "Écrivez à contact@studioes.fr.") + '</p></div>'; });

  /* règlement d'un abonnement Fill : collectivité sur Chorus Pro à terme échu, entreprise chaque mois à l'avance par virement automatique ou par carte (aucun prélèvement) */
  function reglement(){ if(D.marque !== "fill") return null;
    if((D.articles || []).some(function(a){ return /factur|r[èe]glement|paiement/i.test(a.t || ""); })) return null;
    return {t:"Règlement", texte:D.public ? "Factures mensuelles à terme échu, payables à 30 jours, déposées sur Chorus Pro." : "L’abonnement se règle chaque mois à l’avance, au choix par virement automatique (virement permanent que le client programme depuis sa banque, d’après la facture ou l’échéancier envoyé par Fill, qui portent l’IBAN) ou par carte en ligne, avec le lien de paiement personnel indiqué sur chaque facture. Aucun prélèvement n’est effectué. Les unités du premier mois sont créditées au premier règlement (dès le paiement par carte, ou à réception du virement), puis le premier jour de chaque mois."}; }
  function articles(){ var r = reglement(); return (D.articles || []).concat(r ? [r] : []); }
  /* signature enregistrée par Studio ES dans data.json : {"date": "AAAA-MM-JJ" ou ISO, "nom", "fonction"} */
  function signeeD(){ var s = D.signee; if(!s) return null; if(typeof s === "string") s = {date:s}; return s.date ? s : null; }

  function texteSigne(){
    var t = [D.titre || "Bon de commande", "Réf. " + (D.ref || ""), "Client : " + (D.client && D.client.nom || ""), "Objet : " + (D.objet || "")];
    (D.lignes || []).forEach(function(l){ t.push(l.l + " | " + (l.detail || "") + " | " + eur(l.p) + (l.u ? " " + l.u : "")); });
    articles().forEach(function(a){ t.push(a.t + " : " + a.texte); });
    if(D.annexe) t.push(D.annexe.titre + " : " + D.annexe.texte);
    t.push("Conditions générales : " + (D.cgv || "") + (D.cgvVersion ? ", version du " + D.cgvVersion : ""));
    return t.join("\n");
  }
  function empreinte(txt){ if(!(window.crypto && crypto.subtle && window.TextEncoder)) return Promise.resolve(""); return crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt)).then(function(b){ return Array.prototype.map.call(new Uint8Array(b), function(x){ return ("0" + x.toString(16)).slice(-2); }).join(""); }, function(){ return ""; }); }

  function rendre(){
    var fill = D.marque === "fill", C = D.client || {}, sD = signeeD(), s = sD || lire();
    document.body.className = fill ? "fill" : "";
    document.title = (D.titre || "Bon de commande") + " · " + (fill ? "Fill" : "Studio ES");
    var h = '<div class="w"><header><div class="marque">' + (fill ? "Fill" : "Studio ES") + '</div><h1>' + esc(D.titre || "Bon de commande") + '<em>' + esc(C.nom || "") + ', réf. ' + esc(D.ref || "") + '</em></h1></header>';
    h += '<section class="feuille"><div class="parties"><div><b>Prestataire</b>Studio ES' + (fill ? ", pour son service Fill" : "") + '<br>Ewen Soupault, entrepreneur individuel<br>SIRET 834 922 486 00016<br>contact@studioes.fr</div>' +
      '<div><b>Client</b>' + esc(C.nom || "") + (C.adresse ? '<br>' + esc(C.adresse) : "") + (C.siret ? '<br>SIRET ' + esc(C.siret) : "") + (C.signataire && C.signataire.nom ? '<br>Représenté par ' + esc(C.signataire.nom) + (C.signataire.fonction ? ", " + esc(C.signataire.fonction) : "") : "") + '</div></div>';
    if(D.objet) h += '<p><b>Objet :</b> ' + esc(D.objet) + '</p>';
    if(D.cgvVersion) h += '<p class="aide"><b>Conditions générales applicables :</b> version du ' + esc(D.cgvVersion) + '.</p>';
    if((D.lignes || []).length){ h += '<table><thead><tr><th>Prestation</th><th class="n">Prix net</th></tr></thead><tbody>';
      D.lignes.forEach(function(l){ h += '<tr><td>' + esc(l.l) + (l.detail ? '<small>' + esc(l.detail) + '</small>' : "") + '</td><td class="n">' + eur(l.p) + (l.u ? ' ' + esc(l.u) : "") + '</td></tr>'; });
      var T = D.total || {}; if(T.ponctuel) h += '<tr class="tot"><td>Total des prestations ponctuelles</td><td class="n">' + eur(T.ponctuel) + '</td></tr>'; if(T.mensuel) h += '<tr class="tot"><td>Abonnement mensuel</td><td class="n">' + eur(T.mensuel) + ' par mois</td></tr>';
      h += '</tbody></table><p class="aide">Montants nets. TVA non applicable, article 293 B du CGI.</p>'; }
    if(articles().length){ h += '<div class="art">'; articles().forEach(function(a){ h += '<h3>' + esc(a.t) + '</h3><p>' + esc(a.texte).replace(/\n/g, "<br>") + '</p>'; }); h += '</div>'; }
    h += '<p class="aide">Les conditions générales ' + (fill ? "de service de Fill" : "de vente de Studio ES") + ' font partie de la commande : <a href="' + esc(D.cgv) + '" target="_blank" rel="noopener">' + esc(String(D.cgv || "").replace(/^https?:\/\//, "")) + '</a>' + (D.cgvVersion ? ", version du " + esc(D.cgvVersion) : "") + '.</p>';
    if(D.annexe) h += '<details class="annexe"><summary><b>' + esc(D.annexe.titre) + '</b></summary><pre>' + esc(D.annexe.texte) + '</pre></details>';
    h += '</section>';

    h += '<section class="feuille" id="sig">';
    if(s){ var heure = /T\d/.test(String(s.date)) ? ' à ' + heureFr(s.date) : ''; h += '<div class="signe"><b>Commande signée</b>Signée ' + (sD && !s.empreinte ? '' : 'en ligne ') + 'le ' + dateFr(s.date) + heure + (s.nom ? ' par ' + esc(s.nom) + (s.fonction ? ", " + esc(s.fonction) : "") : "") + '.' + (s.empreinte ? '<br><span class="aide">Empreinte du texte signé : ' + esc(s.empreinte.slice(0, 16)) + '…</span>' : "") + '</div>' +
        '<div class="ligne np"><button class="bt" type="button" id="imp">Enregistrer mon exemplaire en PDF</button></div><p class="aide np">Votre navigateur propose « Enregistrer au format PDF » dans la fenêtre d’impression.</p>'; }
    else {
      var pre = !!(C.signataire && C.signataire.nom && C.mail);
      h += '<h2>Signer la commande</h2>' + (pre ? '<p class="aide">Vos informations sont déjà renseignées : vérifiez-les, puis cochez la case.</p>' : '') + (D.public ? '<p class="aide">Vous pouvez signer ici, ou nous adresser votre propre bon de commande en y faisant référence (réf. ' + esc(D.ref) + ').</p>' : "") +
        '<form class="signer" novalidate><div class="champs"><label class="c">Nom et prénom<input name="nom" autocomplete="name" value="' + esc(C.signataire && C.signataire.nom || "") + '" required></label>' +
        '<label class="c">Fonction<input name="fonction" autocomplete="organization-title" value="' + esc(C.signataire && C.signataire.fonction || "") + '" required></label>' +
        '<label class="c">E-mail, pour recevoir votre confirmation<input name="email" type="email" inputmode="email" autocomplete="email" value="' + esc(C.mail || "") + '" required></label></div>' +
        '<label class="ok"><input type="checkbox" name="ok"><span>Lu et approuvé, bon pour commande. J’ai lu ' + (D.annexe ? "le bon de commande, son annexe et " : "le bon de commande et ") + 'les conditions générales, et je suis habilité' + '(e) à engager ' + esc(C.nom || "la structure") + '.</span></label>' +
        '<p class="err" aria-live="polite"></p><div class="ligne"><button class="bt" type="submit" disabled>Signer la commande</button></div>' +
        '<p class="aide">Ces informations servent à enregistrer votre commande et à vous recontacter. Elles sont transmises par e-mail via un service hébergé chez Supabase (serveurs à Paris) et l’envoi d’e-mails Brevo (France), puis arrivent dans la messagerie de Studio ES. Détails et droits : <a href="' + (fill ? "https://fill.studioes.fr/conditions/" : "https://studioes.fr/conditions/") + '" target="_blank" rel="noopener">' + (fill ? "fill.studioes.fr/conditions" : "studioes.fr/conditions") + '</a>.</p></form>';
    }
    h += '</section><footer class="np">Studio ES, Ewen Soupault, EI · SIRET 834 922 486 00016 · contact@studioes.fr · <a href="https://studioes.fr/conditions/">Mentions légales</a></footer></div>';
    app.innerHTML = h;

    var imp = document.getElementById("imp"); if(imp) imp.addEventListener("click", function(){ window.print(); });
    var f = app.querySelector("form"); if(!f) return;
    var b = f.querySelector('button[type="submit"]'), err = f.querySelector(".err");
    f.addEventListener("change", function(){ b.disabled = !f.ok.checked; });
    f.addEventListener("submit", function(ev){ ev.preventDefault();
      var nom = f.nom.value.trim(), fo = f.fonction.value.trim(), ml = f.email.value.trim();
      if(!nom || !fo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ml) || !f.ok.checked){ err.textContent = "Indiquez votre nom, votre fonction et votre e-mail, puis cochez la case."; return; }
      b.disabled = true; b.textContent = "Signature en cours…"; err.textContent = "";
      var quand = new Date().toISOString();
      empreinte(texteSigne()).then(function(hash){
        var corps = {_subject:"Commande signée : " + (C.nom || "") + " (réf. " + (D.ref || "") + ")", _template:"table", _captcha:"false",
          _autoresponse:"Bonjour,\n\nNous avons bien reçu votre commande « " + (D.objet || D.titre || "") + " » (réf. " + (D.ref || "") + "), signée le " + dateFr(quand) + ". Votre exemplaire reste consultable ici : " + location.href + "\n\nBien cordialement\nEwen Soupault, " + (fill ? "Fill" : "Studio ES"),
          source:"commande", marque:D.marque || "studio", reference:D.ref || "", fiche:D.fiche || "", structure:C.nom || "", nom:nom, fonction:fo, email:ml, signee_le:quand, cgv:D.cgv || "", cgv_version:D.cgvVersion || "", page:location.href, empreinte:hash, navigateur:navigator.userAgent};
        return fetch("https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/formulaire", {method:"POST", headers:{"Content-Type":"application/json", Accept:"application/json"}, body:JSON.stringify(corps)}).then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(function(){ return hash; });
      }).then(function(hash){ garder({date:quand, nom:nom, fonction:fo, email:ml, empreinte:hash}); rendre(); document.getElementById("sig").scrollIntoView({behavior:"smooth"}); }, function(){
        b.disabled = false; b.textContent = "Signer la commande"; err.textContent = "La signature n’est pas partie. Vérifiez votre connexion et réessayez, ou écrivez à contact@studioes.fr."; });
    });
  }
})();
