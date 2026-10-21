/* Devis PDF Studio ES, à la charte : en-tête encre et vague, De / Pour, objet, rubriques par échéance,
   encadré « Ce que vous réglez, et quand », conditions particulières, CGV. Généré dans le navigateur (jsPDF). */
(function(){
  var INK = "#141414", CREAM = "#F0EEE9", CR2 = "#F0EEE9", GR = "#5E5E5A";
  var EMETTEUR = ["Ewen Soupault, entrepreneur individuel (EI)", "Lieu-dit Kerdavid, 29390 Leuhan", "06 51 22 21 07  ·  contact@studioes.fr", "Siret 834 922 486 00016"];
  function fr(v){ v = Math.round(v * 100) / 100; var e = Math.floor(v), d = Math.round((v - e) * 100); if(d === 100){ e++; d = 0; } return String(e).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (d ? "," + (d < 10 ? "0" : "") + d : ""); }
  function eur(v){ return fr(v) + " €"; }
  function p2(n){ return ("0" + n).slice(-2); }
  function dmy(x){ return p2(x.getDate()) + "/" + p2(x.getMonth() + 1) + "/" + x.getFullYear(); }

  /* D : {nom, objet}, lignes : [{n, l:[...], p, mois}], client : {struct, rep, fonction, adr, ville, mail}, num, accept : {date, nom} ou null */
  window.studioDevis = function(D, lignes, client, num, accept, regles){
    var J = window.jspdf.jsPDF, d = new J({unit:"pt", format:"a4"}), W = 595.28, H = 841.89, L = 48, R = 547, CQ = 430, y = 0;
    [["BricoXB","Brico"],["InterL","JostL"],["InterM","JostM"]].forEach(function(f){ d.addFileToVFS(f[0] + ".ttf", window.DEVIS_FONTS[f[0]]); d.addFont(f[0] + ".ttf", f[1], "normal"); });
    var now = accept && accept.date ? new Date(accept.date) : new Date(), lim = new Date(now.getTime() + 30 * 864e5);
    function F(f, s, c){ d.setFont(f, "normal"); d.setFontSize(s); d.setTextColor(c || INK); }
    function logo(x, y0, h, col){ var s = h / 186, P = [179.42,76.92,179.42,158.43,136.95,158.43,136.95,174.56,179.42,174.56,179.42,223.32,120.58,223.32,120.58,207.07,163.05,207.07,163.05,190.93,120.58,190.93,120.58,142.05,163.05,142.05,163.05,125.92,120.7,125.92,120.58,109.55,163.05,109.55,163.05,93.3,120.58,93.3,120.58,76.92], DD = [];
      for(var i = 2; i < P.length; i += 2) DD.push([(P[i] - P[i-2]) * s, (P[i+1] - P[i-1]) * s]);
      d.setFillColor(col); d.lines(DD, x + (P[0] - 101) * s, y0 + (P[1] - 57) * s, [1,1], "F", true);
      d.setDrawColor(col); d.setLineWidth(1.33 * s); d.rect(x + 2.67 * s, y0 + 3 * s, 92.65 * s, 180 * s, "S"); }
    function wave(y0, A){ var hw = W / 4, DD = [], sg = -1; for(var i = 0; i < 4; i++){ DD.push([hw * .4, 0, hw * .6, sg * A, hw, sg * A]); sg = -sg; } DD.push([0, 60]); DD.push([-W, 0]); d.setFillColor("#ffffff"); d.lines(DD, 0, y0, [1,1], "F", true); }
    function corners(x, y0, w, h, c){ var a = 10; d.setDrawColor(c); d.setLineWidth(1.3); [[x,y0,1,1],[x+w,y0,-1,1],[x,y0+h,1,-1],[x+w,y0+h,-1,-1]].forEach(function(k){ d.line(k[0],k[1],k[0]+a*k[2],k[1]); d.line(k[0],k[1],k[0],k[1]+a*k[3]); }); }
    function page(){ d.addPage(); y = 62; }
    function need(h){ if(y + h > H - 62){ page(); return true; } return false; }
    function para(t, x, w, lh){ var a = d.splitTextToSize(t, w); a.forEach(function(l){ d.text(l, x, y); y += lh; }); return a.length; }
    function section(t, sub, h){ need(h || 130); y += 10; F("Brico", 14); d.text(t, L, y, {charSpace:-.3}); var tw = d.getTextWidth(t); F("JostL", 9.5, GR); d.text(sub, L + tw + 10, y);
      d.text("Qté", CQ, y, {align:"center"}); d.text("Montant", R, y, {align:"right"}); d.setDrawColor(INK); d.setLineWidth(.9); d.line(L, y + 7, R, y + 7); y += 25; }
    function poste(t, ls, amt){ F("JostL", 9); var h = 16; ls.forEach(function(l){ h += d.splitTextToSize(l, 300).length * 12.2; }); need(h + 8);
      F("JostM", 10.5); d.text(t, L, y); F("JostL", 10, GR); d.text("1", CQ, y, {align:"center"}); F("JostL", 10.5, INK); d.text(amt, R, y, {align:"right"}); y += 15;
      ls.forEach(function(l){ F("JostL", 9, GR); d.text("•", L + 3, y); para(l, L + 13, 300, 12); }); y += 6; }
    function total(label, v){ need(40); var x0 = 318; d.setDrawColor(INK); d.setLineWidth(.9); d.line(x0, y - 4, R, y - 4); y += 14; F("Brico", 11.5); d.text(label, x0, y); F("Brico", 14); d.text(eur(v), R, y + .5, {align:"right"}); y += 28; }

    /* en-tête */
    d.setFillColor(INK); d.rect(0, 0, W, 132, "F"); wave(121, 7);
    logo(L, 37.5, 46.5, CREAM); F("Brico", 62, CREAM); d.text("Devis", L + 36, 84, {charSpace:-2.6});
    F("Brico", 16, CREAM); d.text("#" + num, R, 52, {align:"right"}); F("JostL", 10.5, CREAM); d.text(dmy(now), R, 68, {align:"right"}); d.text("Valable jusqu'au " + dmy(lim), R, 82, {align:"right"});
    y = 174; var yc = y;
    F("Brico", 11); d.text("De", L, y); y += 17; F("JostM", 10.5); d.text("Studio ES", L, y); y += 13.5; F("JostL", 9.8, GR);
    EMETTEUR.forEach(function(l){ d.text(l, L, y); y += 13; });
    var y1 = y; y = yc; F("Brico", 11); d.text("Pour", 320, y); y += 17; F("JostM", 10.5); d.text(client.struct || D.nom, 320, y); y += 13.5; F("JostL", 9.8, GR);
    [client.rep ? "Représentée par " + client.rep + (client.fonction ? ", " + client.fonction : "") : "", client.adr, client.ville, client.mail].forEach(function(l){ if(l){ d.text(l, 320, y); y += 13; } });
    y = Math.max(y, y1) + 16; F("Brico", 11); d.text("Objet", L, y); F("JostL", 11, INK); para(D.objet || ("Prestations pour " + D.nom), L + 44, R - L - 44, 14); y += 16;

    var once = lignes.filter(function(x){ return !x.mois && !x.devis; }), mois = lignes.filter(function(x){ return x.mois; }), devis = lignes.filter(function(x){ return x.devis; });
    var tOnce = once.reduce(function(a, x){ return a + x.p; }, 0), tMois = mois.reduce(function(a, x){ return a + x.p; }, 0), n = 1;
    if(once.length){ section(n++ + ". Les prestations", "réglées une fois"); once.forEach(function(x){ poste(x.n, x.l || [], eur(x.p)); }); total("Total", tOnce); }
    if(mois.length){ section(n++ + ". Le suivi", "réglé chaque mois", 160); mois.forEach(function(x){ poste(x.n, (x.l || []).filter(function(t){ return !/^Engagement de/.test(t); }).concat(x.min ? ["Engagement de " + x.min + " mois minimum"] : []), eur(x.p)); }); total("Total par mois", tMois); }
    if(devis.length){ section(n++ + ". Sur devis séparé", "à chiffrer ensemble", 120); devis.forEach(function(x){ poste(x.n, (x.l || []).concat(["Chiffré après notre échange, sur devis séparé"]), "à chiffrer"); }); y += 6; }

    var E = [];
    var PUB = !!(D && D.public); if(tOnce){ if(PUB) E.push(["Après service fait", "Sur facture, par mandat administratif", tOnce]); else { E.push(["À la commande", "Acompte de 30 %, réglé en ligne", tOnce * .3]); E.push(["À la livraison", "Solde de 70 %", tOnce * .7]); } }
    if(tMois) E.push(["Chaque mois", "Suivi, à partir de la date convenue ensemble", tMois]);
    if(E.length){ var bh = 58 + E.length * 24; need(bh + 6); y += 14; d.setFillColor(CR2); d.rect(L, y - 16, R - L, bh, "F"); var yb = y - 16 + bh;
      F("Brico", 13); d.text("Ce que vous réglez, et quand", L + 16, y + 6, {charSpace:-.3}); y += 32;
      E.forEach(function(e, i){ if(i){ d.setDrawColor("#E2DED6"); d.setLineWidth(.6); d.line(L + 16, y - 15, R - 16, y - 15); } F("JostM", 10.5); d.text(e[0], L + 16, y); F("JostL", 9.5, GR); d.text(e[1], L + 150, y); F("Brico", 12.5); d.text(eur(e[2]), R - 16, y + .5, {align:"right"}); y += 24; });
      F("JostL", 8.5, GR); d.text("Montants nets. TVA non applicable, art. 293 B du CGI. Devis gratuit.", L + 16, yb - 10); y = yb + 20; }

    /* conditions particulières */
    if(y > H - 330) page(); else y += 30; F("Brico", 26); d.text("Conditions particulières", L, y + 8, {charSpace:-1}); y += 40;
    function bloc(t, ls){ F("JostL", 9); var h = 16; ls.forEach(function(l){ h += d.splitTextToSize(l, R - L).length * 12 + 1; }); need(h + 8); F("Brico", 10.5); d.text(t, L, y); y += 14; ls.forEach(function(l){ F("JostL", 9, GR); para(l, L, R - L, 12); y += 1; }); y += 8; }
    bloc("Validité", ["Ce devis est gratuit et valable 30 jours à compter de sa date d'émission."]);
    if(PUB) bloc("Commande", ["La commande est ferme à réception du devis signé par une personne habilitée ou d'un bon de commande qui y fait référence."]); else bloc("Commande", ["La commande est ferme et définitive dès l'acceptation en ligne du présent devis et le paiement de l'acompte. L'acceptation en ligne a la même valeur qu'une signature manuscrite.", "Les sommes versées à la commande sont un acompte et non des arrhes : elles restent acquises au prestataire et engagent les deux parties sur la totalité de la commande.", "Le client déclare commander pour les besoins de son activité professionnelle ou associative."]);
    bloc("Règlement", [PUB ? (tOnce ? "Prestations facturées après service fait, réglées par mandat administratif dans le délai légal de paiement. Facture déposée sur Chorus Pro sur demande. " : "") + (tMois ? "Suivi mensuel : démarrage fixé d'un commun accord, facturé à terme échu chaque mois. " : "") : (tOnce ? "Prestations : acompte de 30 % à la commande, réglé en ligne par carte bancaire ; solde de 70 % à la livraison, par virement, à réception de facture. " : "") + (tMois ? "Suivi mensuel : la date de démarrage est fixée d'un commun accord lors de notre premier échange ; il est facturé en début de mois. " : "") + "Pas d'escompte pour paiement anticipé."]);
    if(tMois) bloc("Durée du suivi", ["Le suivi mensuel est conclu pour une durée indéterminée, avec la durée minimale indiquée pour chaque ligne à compter de son démarrage. Passé cette durée, chaque partie peut y mettre fin à tout moment, par écrit (un e-mail suffit), avec un préavis d'un mois."]);
    bloc("Périmètre", (regles && regles.length ? regles : []).concat(["Deux allers-retours de corrections sont compris par livrable. Toute demande hors du périmètre décrit fait l'objet d'un devis complémentaire.", "Les déplacements sont compris dans un rayon de 50 km autour de Leuhan."]));
    bloc("Droits sur les créations", ["Après paiement complet, le prestataire concède au client, à titre non exclusif, le droit de reproduire et de représenter les créations et photographies livrées pour sa communication (site internet, réseaux sociaux, supports imprimés), sans limite de territoire et pour toute la durée de protection des droits. Toute cession à un tiers ou tout autre usage fait l'objet d'un accord écrit.", "Les photographies sont créditées « Studio ES » lorsque le support le permet."]);

    need(120); y += 2; d.setFillColor(CR2); d.rect(L, y - 10, R - L, accept ? 84 : 104, "F");
    F("Brico", 11); d.text(accept ? "Devis accepté en ligne" : "Bon pour accord", L + 14, y + 10); F("JostL", 9, GR);
    if(accept){ d.text("Accepté le " + dmy(now) + " à " + p2(now.getHours()) + " h " + p2(now.getMinutes()) + " par " + (accept.nom || client.rep || "") + (client.mail ? " (" + client.mail + ")" : "") + ".", L + 14, y + 28);
      d.text("Commande ferme dès réception de l'acompte. Référence de paiement : " + num + ".", L + 14, y + 44); y += 96; }
    else { d.text("Accepté en ligne, ou daté et signé avec la mention « Lu et approuvé, bon pour commande ».", L + 14, y + 26);
      d.setDrawColor(INK); d.setLineWidth(.6); d.line(L + 14, y + 74, L + 170, y + 74); d.line(L + 210, y + 74, R - 14, y + 74); F("JostL", 8, GR); d.text("Date et lieu", L + 14, y + 85); d.text("Signature", L + 210, y + 85); y += 116; }
    ["Ewen Soupault, entrepreneur individuel (EI), Studio ES. Siret 834 922 486 00016. TVA non applicable, art. 293 B du CGI.", "Les conditions générales de vente ci-après font partie intégrante du présent devis. En cas de divergence, les conditions particulières prévalent."].forEach(function(l){ F("JostL", 8, GR); para(l, L, R - L, 10.4); });

    /* CGV */
    page(); F("Brico", 22); d.text("Conditions générales de vente", L, y + 6, {charSpace:-.8}); y += 30; F("JostL", 8.6, GR);
    para("Les relations entre Studio ES (le prestataire) et le client sont régies par les présentes conditions générales de vente, complétées par le devis et ses conditions particulières. En cas de divergence, les conditions particulières prévalent. L'acceptation du devis implique l'adhésion pleine et entière à ces conditions.", L, R - L, 11.6); y += 14;
    var CGV = window.STUDIO_CGV, cw = (R - L - 26) / 2, cx = [L, L + cw + 26];
    var hs = CGV.map(function(a){ F("JostL", 8.3); var h = 22; a[1].forEach(function(l){ h += d.splitTextToSize(l, cw).length * 11; }); return h; }), tot = hs.reduce(function(a, b){ return a + b; }, 0), cum = 0, cut = CGV.length;
    for(var i = 0; i < hs.length; i++){ cum += hs[i]; if(cum >= tot / 2){ cut = i + 1; break; } }
    var yy = [y, y]; CGV.forEach(function(a, i){ var c = i < cut ? 0 : 1; y = yy[c]; F("Brico", 9.6); d.text(a[0], cx[c], y); y += 13; a[1].forEach(function(l){ F("JostL", 8.3, GR); para(l, cx[c], cw, 11); }); yy[c] = y + 9; });

    var np = d.getNumberOfPages(); for(var k = 1; k <= np; k++){ d.setPage(k); logo(L, H - 50, 22, INK); F("JostL", 8, GR); d.text("Studio ES, photographie et web", L + 19, H - 36); d.text("Devis #" + num + "  ·  page " + k + " sur " + np, R, H - 36, {align:"right"}); }
    return {blob:d.output("blob"), name:"Devis-Studio-ES-" + num + ".pdf"};
  };

  window.STUDIO_CGV = [
    ["1. Objet", ["Les présentes conditions définissent les modalités d'intervention du prestataire pour toute prestation de création graphique, direction artistique, photographie, conception d'outils, création de site internet ou accompagnement en communication."]],
    ["2. Devis et commande", ["Toute prestation fait l'objet d'un devis détaillé. La commande est validée par la signature du devis ou son acceptation en ligne, et par le versement de l'acompte prévu au devis.", "Le prestataire ne commence la prestation qu'après réception de cet acompte."]],
    ["3. Déroulement du projet", ["Les étapes principales incluent : conception, retours, corrections, validation finale, livraison.", "Les modifications hors périmètre du devis peuvent faire l'objet d'une facturation complémentaire."]],
    ["4. Délais", ["Les délais indiqués sont respectés dans la mesure des informations et contenus fournis par le client.", "Tout retard imputable au client (fourniture de contenus, validations, autorisations) entraîne un report des délais d'autant."]],
    ["5. Propriété intellectuelle", ["Le prestataire conserve la propriété intellectuelle de tous les éléments créatifs jusqu'au paiement intégral.", "Après paiement complet, les droits d'usage sont concédés au client selon l'usage défini dans le devis.", "Toute utilisation non prévue dans le devis doit faire l'objet d'un accord écrit et peut être facturée."]],
    ["6. Livraison", ["Les fichiers sont fournis optimisés pour le support prévu : impression, web ou réseaux sociaux.", "La livraison est considérée comme effective dès mise à disposition des fichiers ou mise en ligne."]],
    ["7. Facturation et paiement", ["Les sommes sont exigibles selon l'échéancier figurant au devis. L'acompte se règle en ligne par carte bancaire ; les autres paiements par virement ou tout autre moyen indiqué sur la facture.", "En cas de retard de paiement, des pénalités sont appliquées au taux de 1,5 % du montant dû par mois de retard. Lorsque le client est un professionnel, une indemnité forfaitaire de 40 € pour frais de recouvrement est due en sus (art. L441-10 et D441-5 du Code de commerce)."]],
    ["8. Responsabilités", ["Le prestataire ne peut être tenu responsable des retards ou problèmes liés aux contenus fournis par le client.", "Le client garantit que tous les éléments fournis ne violent pas de droits de tiers.", "Le prestataire n'est pas responsable des services de tiers (plateformes, hébergeurs, imprimeurs) ni des coûts supplémentaires liés à ces tiers."]],
    ["9. Annulation et résiliation", ["Toute annulation par le client après acceptation du devis entraîne la facturation des prestations réalisées jusqu'à ce jour ; l'acompte versé reste acquis au prestataire.", "Le prestataire se réserve le droit de suspendre ou résilier une prestation en cas de non-paiement ou de manquement grave du client."]],
    ["10. Confidentialité", ["Le prestataire s'engage à traiter toutes les informations transmises par le client de manière confidentielle.", "Les identifiants et accès confiés sont conservés de façon sécurisée et restitués ou supprimés à la fin de la mission."]],
    ["11. Portfolio et témoignage", ["Avec l'accord du client, les projets réalisés peuvent être intégrés au portfolio du prestataire.", "Le client peut être sollicité pour un témoignage à la fin de la prestation."]],
    ["12. Droit applicable et litiges", ["Les présentes conditions sont soumises au droit français.", "Avant toute action judiciaire, les parties s'engagent à rechercher une solution amiable. À défaut, le différend est soumis au tribunal compétent."]]
  ];
})();
