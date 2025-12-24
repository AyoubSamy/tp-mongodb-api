require('dotenv').config();
const { MongoClient } = require('mongodb');

// URL de l'API externe
const API_URL = 'https://dummyjson.com/products';

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);

async function seed() {
    try {
        // 1. Connexion au client MongoDB
        await client.connect();
        console.log("✅ Connecté à MongoDB pour le seeding");

        const db = client.db(dbName);
        const collection = db.collection('products');

        // 2. Récupérer les données de l'API (fetch natif)
        console.log("⏳ Récupération des données depuis dummyjson.com...");
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // L'API renvoie un objet { products: [...] }, on veut juste le tableau
        const products = data.products;

        // 3. Supprimer la collection existante (si elle existe)
        try {
            await collection.drop();
            console.log("🗑️  Ancienne collection 'products' supprimée");
        } catch (error) {
            // On ignore l'erreur si la collection n'existe pas encore
            if (error.codeName !== 'NamespaceNotFound') {
                throw error;
            }
        }

        // 4. Insérer les nouveaux produits
        if (products.length > 0) {
            const result = await collection.insertMany(products);
            console.log(`🌱 Succès ! ${result.insertedCount} produits insérés.`);
        } else {
            console.log("⚠️ Aucun produit trouvé à insérer.");
        }

    } catch (error) {
        console.error("❌ Erreur lors du seeding :", error);
    } finally {
        // 5. Déconnecter le client
        await client.close();
        console.log("🔌 Connexion fermée.");
    }
}

seed();