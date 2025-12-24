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

2. Installer les dépendancesBashnpm install
3. ConfigurationCréez un fichier .env à la racine du projet avec les variables suivantes :Extrait de codePORT=3000
MONGO_URI=mongodb://localhost:27017
DB_NAME=tp_mongodb_api
🚀 Utilisation1. Initialiser la Base de Données (Seeding)Ce script récupère les données depuis l'API publique dummyjson.com, nettoie la collection locale et insère les nouveaux produits.Bashnpm run seed
2. Démarrer le ServeurBashnpm start
Le serveur sera accessible sur : http://localhost:3000📡 Endpoints de l'API1. Liste des Produits (Recherche & Pagination)URL : GET /api/productsParamètreDescriptionExemplepageNuméro de page (défaut: 1)?page=2limitÉléments par page (défaut: 10)?limit=5searchRecherche textuelle (Titre/Desc)?search=iphonesortTri (field ou -field)?sort=-price (Prix décroissant)Exemple de requête :http://localhost:3000/api/products?search=phone&sort=price&page=12. Statistiques (Agrégation)URL : GET /api/products/statsRetourne des indicateurs clés (KPIs) calculés directement via le MongoDB Aggregation Pipeline :Stats par catégorie : Nombre de produits, prix moyen, min et max.Top Produits : Les 5 produits les mieux notés ayant un prix > 500$.Valorisation du stock : Valeur totale (Prix × Stock) regroupée par marque.👤 AuteurAyoub Samy 

