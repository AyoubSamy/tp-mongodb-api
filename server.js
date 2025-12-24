require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// Importation des routes
const productRoutes = require('./routes/products'); 

// Middleware pour lire le JSON
app.use(express.json());

const client = new MongoClient(uri);
let db;

async function startServer() {
    try {
        // 1. Connexion au serveur MongoDB
        await client.connect();
        console.log("✅ Connecté avec succès à MongoDB !");

        // 2. Sélection de la base de données
        db = client.db(dbName);

        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        // B. Activation des routes produits
        // C'est ici qu'on dit : "Si l'URL commence par /api/products, va voir dans productRoutes"
        app.use('/api/products', productRoutes);

        // ====================================================

        // Route de test simple (Accueil)
        app.get('/', (req, res) => {
            res.send('API MongoDB est en ligne 🚀');
        });

        // Démarrage du serveur Express
        app.listen(port, () => {
            console.log(`🚀 Serveur Node.js écoute sur http://localhost:${port}`);
        });

    } catch (error) {
        console.error("❌ Erreur de connexion :", error);
        process.exit(1);
    }
}

startServer();

// Gestion de l'arrêt propre (CTRL+C)
process.on('SIGINT', async () => {
    console.log(" Fermeture de la connexion...");
    await client.close();
    process.exit(0);
});