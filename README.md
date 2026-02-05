# My Social Networks

API REST complète pour un réseau social inspiré de Facebook, développée avec Node.js, Express et MongoDB (Mongoose). Toutes les réponses sont en JSON et normalisées.

## ✅ Fonctionnalités principales

- Authentification JWT
- Gestion des utilisateurs, groupes, événements
- Fils de discussion et messages
- Albums photo, photos et commentaires
- Sondages et réponses
- Billetterie (types de billets + achat)
- Sécurité de base (Helmet + rate limit)

## 📁 Arborescence du projet

```
.
├── .env.example
├── package.json
├── README.md
└── src
    ├── app.js
    ├── server.js
    ├── config
    │   └── db.js
    ├── controllers
    │   ├── albumController.js
    │   ├── authController.js
    │   ├── eventController.js
    │   ├── groupController.js
    │   ├── photoController.js
    │   ├── pollController.js
    │   └── ticketController.js
    ├── middlewares
    │   ├── auth.js
    │   └── errorHandler.js
    ├── models
    │   ├── Album.js
    │   ├── Event.js
    │   ├── Group.js
    │   ├── Message.js
    │   ├── Photo.js
    │   ├── PhotoComment.js
    │   ├── Poll.js
    │   ├── PollResponse.js
    │   ├── Thread.js
    │   ├── TicketPurchase.js
    │   ├── TicketType.js
    │   └── User.js
    ├── routes
    │   ├── albumRoutes.js
    │   ├── authRoutes.js
    │   ├── eventRoutes.js
    │   ├── groupRoutes.js
    │   ├── photoRoutes.js
    │   ├── pollRoutes.js
    │   ├── threadRoutes.js
    │   └── ticketRoutes.js
    ├── tests
    │   └── sante.test.js
    ├── utils
    │   └── response.js
    └── validators
        ├── albumValidator.js
        ├── authValidator.js
        ├── eventValidator.js
        ├── groupValidator.js
        ├── pollValidator.js
        ├── threadValidator.js
        └── ticketValidator.js
```

## ⚙️ Installation

1. Dupliquez `.env.example` en `.env` et configurez MongoDB Atlas + JWT.
2. Installez les dépendances.
3. Lancez l’API.

## ▶️ Lancer le serveur

```bash
npm install
npm run dev
```

## ✅ Test rapide intégré

```bash
npm test
```

## 🔐 Authentification

Toutes les routes protégées exigent l’en-tête :

```
Authorization: Bearer VOTRE_JETON
```

## 📌 Endpoints principaux

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Groupes
- GET `/api/groupes`
- GET `/api/groupes/:id`
- POST `/api/groupes`
- POST `/api/groupes/:id/rejoindre`
- POST `/api/groupes/:id/valider/:userId`
- POST `/api/groupes/:id/membres/:userId/supprimer`

### Événements
- GET `/api/evenements`
- GET `/api/evenements/:id`
- POST `/api/evenements`
- POST `/api/evenements/:id/participants`
- POST `/api/evenements/:id/organisateurs/:userId`

### Fils de discussion & messages
- POST `/api/fils`
- GET `/api/fils/:id`
- POST `/api/fils/:id/messages`
- GET `/api/fils/:id/messages`

### Albums & photos
- POST `/api/albums`
- GET `/api/albums/:id`
- POST `/api/albums/:id/photos`
- GET `/api/albums/:id/photos`
- POST `/api/photos/:id/commentaires`
- GET `/api/photos/:id/commentaires`

### Sondages
- POST `/api/sondages`
- GET `/api/sondages/:id`
- POST `/api/sondages/:id/reponses`

### Billetterie
- POST `/api/billetterie/types`
- GET `/api/billetterie/evenements/:eventId/types`
- POST `/api/billetterie/acheter`

### Bonus (shopping list / covoiturage)
- POST `/api/bonus/evenements/:id/shopping`
- GET `/api/bonus/evenements/:id/shopping`
- POST `/api/bonus/evenements/:id/covoiturage`
- GET `/api/bonus/evenements/:id/covoiturage`

## 📮 Exemples Postman (prêts à l’emploi)

### 1) Inscription
**POST** `http://localhost:4000/api/auth/register`

**Body (JSON)**
```json
{
  "prenom": "Lina",
  "nom": "Martin",
  "email": "lina.martin@mail.com",
  "motDePasse": "MotDePasse!123"
}
```

### 2) Connexion
**POST** `http://localhost:4000/api/auth/login`

**Body (JSON)**
```json
{
  "email": "lina.martin@mail.com",
  "motDePasse": "MotDePasse!123"
}
```

### 3) Création d’un groupe
**POST** `http://localhost:4000/api/groupes`

**Headers**
```
Authorization: Bearer VOTRE_JETON
```

**Body (JSON)**
```json
{
  "nom": "Développeurs Backend",
  "description": "Communauté des passionnés d’API et de microservices.",
  "icone": "https://exemple.com/icone.png",
  "photoCouverture": "https://exemple.com/couverture.png",
  "type": "public",
  "autoriserPublicationMembres": true,
  "autoriserCreationEvenementsMembres": true
}
```

### 4) Création d’un événement
**POST** `http://localhost:4000/api/evenements`

**Headers**
```
Authorization: Bearer VOTRE_JETON
```

**Body (JSON)**
```json
{
  "nom": "Meetup API 2026",
  "description": "Échanges et ateliers autour des APIs modernes.",
  "dateDebut": "2026-05-10T18:00:00.000Z",
  "dateFin": "2026-05-10T22:00:00.000Z",
  "lieu": "Paris",
  "photoCouverture": "https://exemple.com/evenement.png",
  "visibilite": "public",
  "options": {
    "billetterieActivee": true,
    "shoppingList": false,
    "covoiturage": true
  }
}
```

### 5) Création d’un sondage
**POST** `http://localhost:4000/api/sondages`

**Headers**
```
Authorization: Bearer VOTRE_JETON
```

**Body (JSON)**
```json
{
  "evenement": "ID_EVENEMENT",
  "questions": [
    {
      "question": "Quel format préférez-vous ?",
      "options": ["Atelier", "Conférence", "Table ronde"]
    },
    {
      "question": "Quel créneau vous convient ?",
      "options": ["Matin", "Après-midi"]
    }
  ]
}
```

### 6) Achat d’un billet
**POST** `http://localhost:4000/api/billetterie/acheter`

**Body (JSON)**
```json
{
  "billetType": "ID_TYPE_BILLET",
  "prenom": "Nadia",
  "nom": "Lefèvre",
  "adresse": "12 rue des Lilas, 75010 Paris",
  "email": "nadia.lefevre@mail.com"
}
```

### 7) Ajout d’un article shopping list
**POST** `http://localhost:4000/api/bonus/evenements/ID_EVENEMENT/shopping`

**Headers**
```
Authorization: Bearer VOTRE_JETON
```

**Body (JSON)**
```json
{
  "nom": "Boissons",
  "quantite": 12
}
```

### 8) Création d’un covoiturage
**POST** `http://localhost:4000/api/bonus/evenements/ID_EVENEMENT/covoiturage`

**Headers**
```
Authorization: Bearer VOTRE_JETON
```

**Body (JSON)**
```json
{
  "pointDepart": "Gare de Lyon",
  "placesTotal": 3,
  "commentaire": "Départ à 18h"
}
```

## 🧩 Notes métier

- Les groupes privés/secret nécessitent validation par un administrateur.
- Les événements privés ne sont pas ouverts à l’adhésion directe.
- Les albums sont accessibles uniquement aux participants de l’événement.
- Un participant ne peut répondre qu’une seule fois à un sondage.
- Billetterie : un seul billet par email et par événement.
- La billetterie ne peut être activée que pour un événement public.
- Un groupe doit toujours conserver au moins un membre et un administrateur.
