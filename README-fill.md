# Dossiers Fill

Modèle : `_modele-fill/index.html` (à copier tel quel dans `<slug>/index.html`), puis `<slug>/data.json`.
Rendu : `assets/fill-dossier.js` et `.css`. Prix et unités lus sur https://fill.studioes.fr/assets/offre.js (repli intégré).
Exemples fictifs : `exemple-fill/` (abonnement), `exemple-fill-relais/` (commune qui recrute).

Champs de `data.json` :
- `marque` : "fill" ; `nom` ; `type` : "collectivite" ou "entreprise" ; `ville` ; `date` (AAAA-MM-JJ)
- `titre`, `sousTitre` (facultatifs, sinon « Votre communication, / sans perdre le fil. »)
- `accroche` : 2 phrases, constat sur eux, sans « je »
- `signal` (facultatif) : {`type`: "recrutement" | "autre", `titre`, `texte`, `lien`}
- `introConstats` (facultatif) ; `constats` : 3 ou 4 {`titre`, `etat`: bien | moyen | absent, `texte`, `lien`}
- `mois` (facultatif, absent pour Relais) : {`intro`, `note`, `items`: [{`type`, `n`, `titre`, `texte`, `semaine`}]}
  types : post, actu, agenda, presse, news, page, gabarit, affiche, flyer, bulletin, photo, point, moder (jamais video)
- `formule` : essentiel | regulier | soutenu | relais (sinon calculée sur les unités du mois) ; `pourquoi` : 1 à 2 phrases
- `faq` (facultatif) : [{`q`, `r`}] ; `contact` : {`rdv`, `mail`}
