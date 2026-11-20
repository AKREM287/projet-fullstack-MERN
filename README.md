# Red Gold · Banque de sang (MERN)

Application de gestion de banque de sang : **organisations**, **donneurs**, **hôpitaux** et **administrateur**.
Stack : MongoDB · Express · React · Node.js (Redux Toolkit, JWT, bcrypt, Mongoose).

## Lancer en local

Prérequis : [Node.js 18+](https://nodejs.org) et MongoDB (local ou [Atlas](https://www.mongodb.com/atlas)).

```bash
npm run setup      # installe le backend ET le frontend
# vérifiez le fichier .env (MONGO_URL, JWT_SECRET, ADMIN_CODE)
npm run seed       # (facultatif) crée des comptes et du stock de démonstration
npm run dev        # lance l'API (port 8080) + le site (port 3000)
```

Ouvrez http://localhost:3000. Comptes de démo (mot de passe `password123`) :

| Rôle | Email |
|---|---|
| Organisation | org@demo.com |
| Hôpital | hopital@demo.com |
| Donneur | donneur@demo.com |
| Administrateur | admin@demo.com |

Créer un compte **administrateur** depuis l'inscription demande le `ADMIN_CODE` du fichier `.env`.

## Règles métier

- Seule une **organisation** enregistre les mouvements : *entrée* = don d'un donneur, *sortie* = livraison à un hôpital.
- Une sortie est refusée si le **stock** du groupe sanguin est insuffisant.
- Un donneur doit attendre **56 jours** entre deux dons ; un don fait au maximum **500 ml**.
- Chaque groupe sous **600 ml** est signalé « stock bas ».
- Chaque rôle n'accède qu'à ses propres données (contrôle côté serveur).

## Structure

```
server.js · config/ · models/ · controllers/ · routes/ · middleware/ · utils/ · scripts/seed.js
client/src : pages/ · components/ (ui, layout, routes) · redux/ · hooks/ · services/ · styles/theme.css
```

## Production

`npm run build`, puis `DEV_MODE=production npm start` : le serveur sert aussi le site compilé.
