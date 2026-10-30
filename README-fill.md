# Dossiers Fill

Modèle : `_modele-fill/index.html` (à copier tel quel dans `<slug>/index.html`), puis `<slug>/data.json`.
Rendu : `assets/fill-dossier.js` et `.css`. Prix et unités lus sur https://fill.studioes.fr/assets/offre.js ; le repli intégré porte les prix publics confirmés : Essentiel 490 € par mois (10 unités), Régulier 990 € (22), Soutenu 1 890 € (45), mise en place 490 ou 990 €, Relais 690 € par semaine ou 2 490 € par mois. Les prix s'affichent « € par mois », avec « TVA non applicable, art. 293 B du CGI ».
Exemples fictifs : `exemple-fill/` (abonnement, avec `commande/`), `exemple-fill-relais/` (commune qui recrute).

## Publication

- **Un nouveau dossier est toujours publié chiffré ; la clé ne figure que dans le lien envoyé et dans la carte Hors-champ.** Écrire le JSON en clair hors du dépôt, puis `python3 outils/dossier.py ecrire <slug> /tmp/<slug>.json` (voir `README.md`, « Outil `outils/dossier.py` »). Le lien à envoyer est celui qu'affiche l'outil : `https://dossiers.studioes.fr/<slug>/#k=<clé>`.
- Slug : nom de la structure plus un suffixe aléatoire de 6 caractères (`mairie-huelgoat-p4x8nd`) ; `python3 outils/dossier.py slug "<nom>"`.
- `expire` : date du dossier plus 45 jours pour un abonnement ; pour Relais, la date de prise de poste ou de vacance du poste lue dans `signal`. Le dossier est retiré automatiquement après cette date (voir `README.md`, « Expiration »).

## Champs de `data.json`

- `marque` : "fill" ; `nom` ; `type` : "collectivite" ou "entreprise" ; `ville` ; `date` (AAAA-MM-JJ) ; `expire` (AAAA-MM-JJ)
- `titre`, `sousTitre` (facultatifs, sinon « Votre communication, / sans perdre le fil. »)
- `accroche` : 2 phrases, constat sur eux, sans « je »
- `signal` (facultatif) : {`type`: "recrutement" | "autre", `titre`, `texte`, `lien`}
- `introConstats` (facultatif) ; `constats` : 3 ou 4 {`titre`, `etat`: bien | moyen | absent, `texte`, `lien`}
- `mois` (facultatif, absent pour Relais) : {`intro`, `note`, `items`: [{`type`, `n`, `titre`, `texte`, `semaine`}]}
  types : post, actu, agenda, presse, news, page, gabarit, affiche, flyer, bulletin, photo, point, moder (jamais video)
- `formule` : essentiel | regulier | soutenu | relais (sinon calculée sur les unités du mois) ; `pourquoi` : 1 à 2 phrases
- `faq` (facultatif) : [{`q`, `r`}] ; `contact` : {`rdv`, `mail`}

## Bon de commande (`<slug>/commande/`)

Copier `_modele-commande/index.html` dans `<slug>/commande/index.html`, puis écrire `<slug>/commande/data.json` (chiffré : `python3 outils/dossier.py ecrire <slug>/commande /tmp/commande.json --cle <clé du dossier>`, même clé que le dossier pour un seul lien à retenir).

- `marque`, `titre`, `ref`, `fiche`, `public`, `date`, `expire`
- `client` : {`nom`, `adresse`, `siret`, `mail`, `signataire`: {`nom`, `fonction`}} : nom, fonction et e-mail préremplissent le formulaire, le client n'a qu'à vérifier
- `objet`, `lignes` : [{`l`, `detail`, `p`, `u`}], `total` : {`ponctuel`, `mensuel`}, `articles` : [{`t`, `texte`}], `annexe` : {`titre`, `texte`}
- `cgv` (URL) et `cgvVersion` : la version est affichée sur le bon de commande et entre dans le texte signé
- `signee` : {`date`, `nom`, `fonction`} reporté par Studio ES après signature : la commande s'affiche signée sur tous les appareils, sans proposer de la signer à nouveau (le navigateur du signataire garde aussi la signature en attendant)
- Règlement : collectivité, facture mensuelle à terme échu sur Chorus Pro ; entreprise, abonnement réglé chaque mois à l'avance par carte depuis l'Espace Fill (https://fill.studioes.fr/espace/), unités créditées au paiement. Sans article « Facturation » ou « Règlement », la page ajoute la mention qui convient. Aucun prélèvement ni mandat SEPA.
