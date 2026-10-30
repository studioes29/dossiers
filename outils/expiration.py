#!/usr/bin/env python3
"""Liste les dossiers expirés à retirer (utilisé par .github/workflows/expiration.yml).

Un dossier est retiré quand son data.json porte "expire" (AAAA-MM-JJ, lu aussi dans l'enveloppe chiffrée)
antérieur à la date du jour (heure de Paris), qu'il n'a pas de champ "client" et que son éventuel
commande/data.json n'a pas de champ "signee" (un bon de commande chiffré est toujours conservé).
Jamais touchés : _modele*, assets/, app/, declic/, cgv/, outils/, exemple-*, pierceval-tattoo/.
Affiche un nom de dossier par ligne."""
import datetime, json, os, re, sys
from zoneinfo import ZoneInfo

RACINE = sys.argv[1] if len(sys.argv) > 1 else "."
PROTEGES = ("assets", "app", "declic", "cgv", "outils", "pierceval-tattoo")
aujourdhui = datetime.datetime.now(ZoneInfo("Europe/Paris")).date()

def lire(p):
    try:
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None

for nom in sorted(os.listdir(RACINE)):
    if nom.startswith((".", "_modele", "exemple-")) or nom in PROTEGES or not os.path.isdir(os.path.join(RACINE, nom)):
        continue
    d = lire(os.path.join(RACINE, nom, "data.json"))
    if not isinstance(d, dict):
        continue
    exp = d.get("expire") or ""
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", exp) or datetime.date.fromisoformat(exp) >= aujourdhui:
        continue
    if not d.get("enc") and d.get("client"):
        continue
    c = os.path.join(RACINE, nom, "commande", "data.json")
    if os.path.exists(c):
        cd = lire(c)
        if not isinstance(cd, dict) or cd.get("enc") or cd.get("signee"):
            continue
    print(nom)
