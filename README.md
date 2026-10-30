# Dossiers

Dossiers de prospection et pages client de Studio ES (photographie, sites, outils et applications) et de Fill (communication courante), publiés sur https://dossiers.studioes.fr/.
Dossiers Fill : voir `README-fill.md`. Bon de commande en ligne : `_modele-commande/`.

## Règle de publication

- **Un nouveau dossier est toujours publié chiffré ; la clé ne figure que dans le lien envoyé et dans la carte Hors-champ.** Le dépôt est public : un `data.json` en clair est lisible par tous.
- **Slug d'un nouveau dossier** : le nom de la structure en minuscules sans accents, puis un tiret et un suffixe aléatoire de 6 caractères (lettres sans i, l, o et chiffres de 2 à 9) : `mairie-briec-k7q3m9`, `mairie-briec-k7q3m9/commande`. `python3 outils/dossier.py slug "Mairie de Briec"` en propose un.
- Les dossiers déjà en ligne avant le 30 octobre 2026 restent en clair : leurs liens ont été envoyés sans clé.
- Studio ES réalise des projets (photographie, sites, outils et applications). La communication courante (actualités, réseaux, newsletter, affiches, bulletin) relève de Fill : un dossier Studio ES ne propose jamais de prestation de communication au mois, il renvoie vers https://fill.studioes.fr/ sans prix.

## Créer un dossier Studio ES

1. `python3 outils/dossier.py slug "<nom>"` donne le slug.
2. Copier `_modele/index.html` tel quel dans `<slug>/index.html`.
3. Écrire le JSON en clair **hors du dépôt** (par exemple `/tmp/<slug>.json`), avec `expire`.
4. `python3 outils/dossier.py ecrire <slug> /tmp/<slug>.json` : écrit `<slug>/data.json` chiffré et affiche le lien complet `https://dossiers.studioes.fr/<slug>/#k=<clé>`. Ce lien est le seul à envoyer ; il va aussi dans la carte Hors-champ.
5. Commiter `<slug>/index.html` et `<slug>/data.json`, jamais le JSON en clair.

Pour modifier un dossier chiffré : `python3 outils/dossier.py lire <slug> --cle <clé> > /tmp/<slug>.json`, modifier, puis `python3 outils/dossier.py ecrire <slug> /tmp/<slug>.json --cle <clé>` (même clé : le lien envoyé reste valable).

## Outil `outils/dossier.py`

Python 3 et la bibliothèque `cryptography` (`pip install cryptography`). À lancer depuis la racine du dépôt.

| Commande | Effet |
|---|---|
| `python3 outils/dossier.py ecrire <slug> <fichier.json> [--cle K]` | Chiffre le fichier et écrit `<slug>/data.json`. Sans `--cle`, génère une clé (32 octets aléatoires, base64url). Affiche l'URL complète avec `#k=`. |
| `python3 outils/dossier.py lire <slug> --cle K` | Affiche le JSON en clair (un `data.json` en clair est affiché tel quel). |
| `python3 outils/dossier.py lien <slug> --cle K` | Affiche l'URL complète. |
| `python3 outils/dossier.py slug "<nom>"` | Propose un slug avec suffixe aléatoire. |

`<slug>` peut être `<slug>/commande` pour un bon de commande.

Enveloppe écrite dans `data.json` :

```json
{"v": 1, "enc": "AES-GCM", "expire": "2026-12-14", "iv": "<base64url, 12 octets>", "ct": "<base64url, texte chiffré et étiquette>"}
```

`expire` reste en clair pour la suppression automatique. Les pages (`dossier.js`, `fill-dossier.js`, `commande.js`) lisent la clé après `#k=` au chargement, la gardent en mémoire et déchiffrent avec WebCrypto ; sans clé ou avec une mauvaise clé, elles affichent « Lien incomplet : utilisez le lien reçu par e-mail. ». Un `data.json` en clair continue de s'afficher. Les raccourcis internes (pistes, « Composer votre offre ») font défiler la page sans réécrire le `#`.

## Pages hébergées ici (anciens sites Netlify)

- `declic/` : le jeu Déclic (anciennement declic.studioes.fr sur Netlify). Une adresse `declic/#<id d'artifact>` ou `declic/?go#<id>` est renvoyée vers `raccourci.html`, le raccourci d'écran d'accueil vers un artifact claude.ai (ancien `declic/index.html`).
- `cocoon/` : proposition interactive Le Cocoon Studio (anciennement cocoon.studioes.fr sur Netlify). Page HTML seule, sans `data.json` : le script d'expiration ne la retire pas.

## Expiration

- Chaque `data.json` porte `"expire": "AAAA-MM-JJ"` : dossier Studio ES ou Fill abonnement, date du dossier plus 45 jours ; Fill Relais, date de prise de poste ou de vacance indiquée dans `signal`. Les exemples n'en ont pas.
- `.github/workflows/expiration.yml` tourne chaque nuit à 03:17 UTC (et à la demande, « Run workflow ») : il exécute `outils/expiration.py`, puis `git rm -r` chaque dossier dont `expire` est passé, qui n'a pas de champ `client` et dont le `commande/data.json` éventuel n'a pas de `signee` (un bon de commande chiffré est toujours conservé), et commite « Dossiers expirés retirés (<noms>) ».
- Jamais touchés : `_modele*`, `assets/`, `app/`, `declic/`, `cgv/`, `outils/`, `exemple-*`, `pierceval-tattoo/`.
- Pour garder un dossier : repousser `expire`, ou le vider (`""`) quand le projet est signé. Un dossier chiffré ne peut pas être inspecté par le script (le champ `client` est chiffré) : seul `expire` compte, il faut donc le vider à la signature.
- Un dossier retiré affiche `404.html` (« Ce dossier n'est plus en ligne »). L'historique git garde les fichiers retirés ; le chiffrement protège les nouveaux dossiers.

## Champs de `data.json` (Studio ES)

- `nom`, `secteur`, `ville`, `date` (AAAA-MM-JJ), `expire` (AAAA-MM-JJ), `accroche`
- `constats` : 3 ou 4 {`titre`, `texte`, `etat`: bien | moyen | absent, `lien`}
- `pistes` : 1 à 3 {`palier`, `titre`, `texte`} ; `poles`, `titrePoles`, `textePoles` (collectivités)
- `outils` : démonstrations {`type`: demandes | projets | salles | com, `texte`}
- `maquette` : affichée seulement avec `"valide": true` ou une vraie image
- `references` (facultatif), `faq` (facultatif) : [{`q`, `r`}], `contact` : {`rdv`, `mail`}
- `client` : bascule en page client privée (étapes, livrables, documents)
- `configurateur` : {`public`, `objet`, `intro`, `regles`, `etapes`: [{`q`, `aide`, `multi`, `options`: [{`l`, `d`, `p`, `titreDevis`, `lignes`, `mois`, `an`, `min`, `devis`, `aucun`, `obligatoire`, `pourquoi`, `si`: [étape, [options]]}]}]}
- `particulier` (facultatif) : `true` pour un dossier destiné à un particulier (mariage) ; `"choix"` affiche la case « Je suis un particulier » dans le formulaire du devis quand le dossier peut s'adresser aux deux. Jamais dans un dossier `public`.
- `remise` (facultatif) : `{"taux": 10, "libelle": "Remise accordée"}` ou `{"montant": 150, "libelle": "Remise accordée"}`. Elle porte sur les prestations réglées une fois : la page affiche l'ancien total barré et le nouveau, le devis PDF porte une ligne de remise, le total et l'acompte (30 % du total remisé) sont recalculés. Pour un dossier renégocié, ajouter ce champ plutôt que refaire un devis à part.

Délais photo : la sélection est livrée « sous 5 jours » (FAQ générée et lignes de devis), ou « le jour même » quand l'option le prévoit.

## Configurateur, devis et acompte

- Collectivité (`configurateur.public: true`) : pas d'acompte. Devis « bon pour accord », règlement sur facture après service fait (mandat administratif, Chorus Pro), puis rendez-vous. Le configurateur s'arrête à la photographie, au site, aux outils et à leur suivi obligatoire ; un renvoi vers Fill couvre la communication courante.
- Dossier privé : dès qu'il y a un total ponctuel supérieur à 0, le client accepte le devis (case CGV) puis choisit :
  - **Payer l'acompte par carte** : le devis accepté est généré et téléchargé d'abord, puis la page envoie `POST {action:"creer", dossier, devis, structure, nom, email, total, particulier, demarrage_anticipe, retour}` au service `https://nfnbseonwgmtouxsaajd.supabase.co/functions/v1/acompte`, qui calcule 30 % et renvoie `{url, montant}` : la page de paiement Stripe s'ouvre dans l'onglet préparé, ou dans la page même si l'onglet est bloqué (après le PDF). Une erreur `{erreur}` est affichée.
  - **Payer l'acompte par virement** : devis téléchargé avec le statut « accepté, acompte par virement », `POST {action:"virement", …}` au même service (Studio ES est prévenu par e-mail), consigne envoyée au service « formulaire » avec `paiement: virement`, puis le message « La facture d'acompte, avec nos coordonnées bancaires, vous est envoyée sous 24 h. La commande est ferme à réception du virement. ». Aucune coordonnée bancaire dans le dépôt : la facture Indy les porte.
  - Retour de paiement : `…/<slug>/?paye=<session>#k=…`. La page interroge `GET …/acompte?session=<session>` et affiche « Acompte reçu, commande ferme » (montant, n° de devis, facture sous 24 h, « Choisir un créneau »), réessaie 5 fois si le paiement est en attente, puis retire `?paye` de l'adresse en gardant le `#`.
  - Il n'y a plus de liens Stripe par total : le champ `configurateur.acompte` n'est plus lu.
- Particulier : le devis ne contient ni la déclaration d'activité professionnelle ni « acompte acquis » ; il indique le droit de rétractation de 14 jours (studioes.fr/conditions, formulaire type en annexe des CGV). La case « Je demande que la prestation commence avant la fin du délai de rétractation… » est obligatoire avant paiement et figure sur le devis PDF.
- Une consigne (service « formulaire », fiche Hors-champ) part à chaque devis différent (clé : code des choix et état), et à chaque acceptation.
- Sous chaque formulaire, une ligne d'information RGPD ; le pied des deux trames porte un lien « Mentions légales ».
