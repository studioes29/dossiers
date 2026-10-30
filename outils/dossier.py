#!/usr/bin/env python3
"""Chiffre, lit et relie les dossiers publiés sur dossiers.studioes.fr.

Un dossier chiffré est un data.json « enveloppe » :
  {"v": 1, "enc": "AES-GCM", "expire": "AAAA-MM-JJ", "iv": "<base64url>", "ct": "<base64url>"}
La clé (32 octets aléatoires, base64url sans =) ne figure jamais dans le dépôt :
elle suit le # du lien envoyé, https://dossiers.studioes.fr/<slug>/#k=<clé>,
et n'est donc jamais transmise au serveur.

Commandes (depuis la racine du dépôt) :
  python3 outils/dossier.py ecrire <slug> <fichier.json> [--cle K]   chiffre et écrit <slug>/data.json, affiche le lien
  python3 outils/dossier.py lire <slug> --cle K                      affiche le JSON en clair
  python3 outils/dossier.py lien <slug> --cle K                      affiche le lien complet
  python3 outils/dossier.py slug <nom>                               propose un slug avec suffixe aléatoire (mairie-briec-k7q3m9)
<slug> peut être un chemin de bon de commande : <slug>/commande.
Dépendance : pip install cryptography
"""
import argparse, base64, json, os, re, secrets, sys, unicodedata

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ImportError:
    sys.exit("Bibliothèque manquante : pip install cryptography")

BASE = "https://dossiers.studioes.fr/"
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"


def b64e(b):
    return base64.urlsafe_b64encode(b).decode().rstrip("=")


def b64d(s):
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def chemin(slug):
    slug = slug.strip("/")
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*(/commande)?", slug):
        sys.exit("Slug invalide : minuscules, chiffres et tirets, éventuellement suivi de /commande.")
    if slug.split("/")[0].startswith(("_modele", "assets", "app", "declic", "cgv", "outils")):
        sys.exit("Ce dossier est réservé.")
    return slug


def cle_valide(k):
    try:
        b = b64d(k)
    except Exception:
        b = b""
    if len(b) != 32:
        sys.exit("Clé invalide : 32 octets en base64url (43 caractères).")
    return b


def lien(slug, k):
    return BASE + slug + "/#k=" + k


def ecrire(slug, fichier, k=None):
    slug = chemin(slug)
    with open(fichier, encoding="utf-8") as f:
        texte = f.read()
    d = json.loads(texte)
    if isinstance(d, dict) and d.get("enc"):
        sys.exit("Ce fichier est déjà chiffré.")
    expire = d.get("expire", "") if isinstance(d, dict) else ""
    if expire and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", expire):
        sys.exit("Champ expire invalide (AAAA-MM-JJ attendu).")
    k = k or b64e(secrets.token_bytes(32))
    iv = secrets.token_bytes(12)
    clair = json.dumps(d, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    ct = AESGCM(cle_valide(k)).encrypt(iv, clair, None)
    env = {"v": 1, "enc": "AES-GCM", "expire": expire, "iv": b64e(iv), "ct": b64e(ct)}
    dossier = os.path.join(RACINE, slug)
    os.makedirs(dossier, exist_ok=True)
    with open(os.path.join(dossier, "data.json"), "w", encoding="utf-8") as f:
        json.dump(env, f, ensure_ascii=False, indent=1)
        f.write("\n")
    page = os.path.join(dossier, "index.html")
    if not os.path.exists(page):
        print("Attention : " + slug + "/index.html manque (copier le modèle).", file=sys.stderr)
    print(lien(slug, k))


def lire(slug, k):
    slug = chemin(slug)
    with open(os.path.join(RACINE, slug, "data.json"), encoding="utf-8") as f:
        env = json.load(f)
    if not env.get("enc"):
        print(json.dumps(env, ensure_ascii=False, indent=1))
        return
    try:
        clair = AESGCM(cle_valide(k)).decrypt(b64d(env["iv"]), b64d(env["ct"]), None)
    except Exception:
        sys.exit("Déchiffrement impossible : clé incorrecte ou fichier altéré.")
    print(json.dumps(json.loads(clair.decode("utf-8")), ensure_ascii=False, indent=1))


def proposer(nom):
    s = unicodedata.normalize("NFD", nom.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    print(s + "-" + "".join(secrets.choice(ALPHABET) for _ in range(6)))


def main():
    p = argparse.ArgumentParser(description="Dossiers chiffrés de dossiers.studioes.fr")
    sp = p.add_subparsers(dest="cmd", required=True)
    e = sp.add_parser("ecrire", help="chiffre un fichier JSON vers <slug>/data.json")
    e.add_argument("slug"); e.add_argument("fichier"); e.add_argument("--cle")
    l = sp.add_parser("lire", help="affiche le JSON en clair")
    l.add_argument("slug"); l.add_argument("--cle", required=True)
    n = sp.add_parser("lien", help="affiche le lien complet")
    n.add_argument("slug"); n.add_argument("--cle", required=True)
    g = sp.add_parser("slug", help="propose un slug avec suffixe aléatoire")
    g.add_argument("nom")
    a = p.parse_args()
    if a.cmd == "ecrire":
        ecrire(a.slug, a.fichier, a.cle)
    elif a.cmd == "lire":
        lire(a.slug, a.cle)
    elif a.cmd == "lien":
        cle_valide(a.cle); print(lien(chemin(a.slug), a.cle))
    else:
        proposer(a.nom)


if __name__ == "__main__":
    main()
