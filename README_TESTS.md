# Guide de tests Postman — My Social Networks

Ce guide explique comment importer et exécuter la collection Postman pour tester l’API My Social Networks de bout en bout.

## ✅ Fichiers à importer

- `postman_collection.json`
- `postman_environment.json`

## 🚀 Procédure d’exécution

1. Ouvrez Postman.
2. Importez la collection et l’environnement.
3. Sélectionnez l’environnement **My Social Networks - Environnement**.
4. Lancez la collection avec **Collection Runner** (ordre par défaut).

## 🔐 Variables d’environnement fournies

Les variables suivantes sont préconfigurées et alimentées automatiquement par les scripts :

- `baseUrl`
- `tokenAdmin`, `tokenUser`
- `userAId`, `userBId`
- `groupId`, `eventId`, `threadGroupId`, `threadEventId`
- `albumId`, `photoId`
- `pollId`
- `ticketTypeId`
- `purchaseId` (optionnel)
- `shoppingItemId`, `carpoolId` (bonus)

## ✅ Parcours “happy path” couvert

La collection crée automatiquement :

- Utilisateur A + jeton
- Utilisateur B + jeton
- Groupe public + adhésion
- Événement public + participants + organisateurs
- Fil + messages
- Album + photo + commentaire
- Sondage + réponse
- Billets + achat
- Vérification des options bonus sur l’événement

## ❗ Tests négatifs inclus

Chaque module possède au moins un test négatif pour valider :

- Email déjà utilisé (409)
- Accès sans jeton (401)
- Accès sans droits (403)
- Ressource inexistante (404)
- Validation Joi (400)

## ⚠️ Remarques

- Assurez-vous que l’API est démarrée et connectée à MongoDB.
- Les scripts pré-request génèrent des emails uniques pour éviter les conflits.
- Le champ `baseUrl` doit pointer vers l’URL réelle de l’API.
