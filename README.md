# TP : API REST avec Node.js & MongoDB (Driver Natif)

API Backend pour la gestion de produits, réalisée sans ORM (Mongoose) pour maîtriser le driver natif MongoDB. Ce projet inclut des fonctionnalités de filtrage avancé, de pagination et d'analyse de données via des pipelines d'agrégation.

## 🛠 Technologies
- **Runtime :** Node.js
- **Framework :** Express.js
- **Base de données :** MongoDB (Native Driver)
- **Outils :** Dotenv, Nodemon

## ⚙️ Installation

### 1. Cloner le projet
```bash
git clone [https://github.com/ton-utilisateur/tp-mongodb-api.git](https://github.com/ton-utilisateur/tp-mongodb-api.git)
cd tp-mongodb-api

```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration
Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017
DB_NAME=tp_mongodb_api
```

## 🚀 Utilisation

### 1. Initialiser la Base de Données (Seeding)
Ce script récupère les données depuis l'API publique `dummyjson.com`, nettoie la collection locale et insère les nouveaux produits.
```bash
npm run seed
```

### 2. Démarrer le Serveur
```bash
npm start
```
Le serveur sera accessible sur : http://localhost:3000

## 📡 Endpoints de l'API

### 1. Liste des Produits (Recherche & Pagination)
- **URL :** `GET /api/products`
- **Paramètres :**
	- `page` : Numéro de page (défaut : 1) — exemple : `?page=2`
	- `limit` : Éléments par page (défaut : 10) — exemple : `?limit=5`
	- `search` : Recherche textuelle (Titre/Desc) — exemple : `?search=iphone`
	- `sort` : Tri (`field` ou `-field`) — exemple : `?sort=-price` (Prix décroissant)

- **Exemple de requête :**
```bash
curl "http://localhost:3000/api/products?search=phone&sort=price&page=1"
```

### 2. Statistiques (Agrégation)
- **URL :** `GET /api/products/stats`
- **Retour :** Indicateurs clés (KPIs) calculés via le MongoDB Aggregation Pipeline :
	- Stats par catégorie : Nombre de produits, prix moyen, min et max.
	- Top Produits : Les 5 produits les mieux notés ayant un prix > 500$.
	- Valorisation du stock : Valeur totale (Prix × Stock) regroupée par marque.

## 👤 Auteur
Ayoub Samy — 
