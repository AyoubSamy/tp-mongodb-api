const express = require('express');
const router = express.Router();

// Route: GET /api/products/stats
router.get('/stats', async (req, res) => {
    try {
        const collection = req.db.collection('products');

        // --- Exercice 6.1 : Statistiques par Catégorie ---
        const pipelineCategory = [
            {
                $group: {
                    _id: "$category",                 // Grouper par catégorie
                    count: { $sum: 1 },               // Compter le nombre de produits
                    avgPrice: { $avg: "$price" },     // Moyenne des prix
                    maxPrice: { $max: "$price" },     // Prix max
                    minPrice: { $min: "$price" }      // Prix min
                }
            },
            {
                $sort: { avgPrice: -1 }               // Trier par prix moyen décroissant
            },
            {
                $project: {
                    _id: 0,                           // Masquer l'ID interne
                    categoryName: "$_id",             // Renommer _id en categoryName
                    count: 1,
                    avgPrice: { $round: ["$avgPrice", 2] }, // Arrondir (optionnel mais propre)
                    maxPrice: 1,
                    minPrice: 1
                }
            }
        ];

        // --- Exercice 6.2 : Top Produits Premium (> 500$) ---
        const pipelineTopProducts = [
            {
                $match: { price: { $gt: 500 } }       // Filtre 1 : Prix > 500
            },
            {
                $sort: { rating: -1 }                 // Tri : Meilleure note en premier
            },
            {
                $limit: 5                             // Garder seulement les 5 premiers
            },
            {
                $project: {                           // Sélection des champs
                    _id: 0,
                    title: 1,
                    price: 1,
                    rating: 1
                }
            }
        ];

        // --- Exercice 6.3 : Valeur du stock par Marque ---
        const pipelineBrandStats = [
            {
                $group: {
                    _id: "$brand",
                    totalStock: { $sum: "$stock" },
                    // On multiplie prix * stock pour chaque produit, puis on somme le tout
                    totalValue: { $sum: { $multiply: ["$price", "$stock"] } }
                }
            },
            {
                $sort: { totalValue: -1 } // Optionnel : trier par valeur de stock
            },
            {
                $project: {
                    _id: 0,
                    brand: "$_id",
                    totalStock: 1,
                    totalValue: 1
                }
            }
        ];

        // Exécution des 3 requêtes en parallèle (Performance optimale)
        const [statsByCategory, topProducts, brandStats] = await Promise.all([
            collection.aggregate(pipelineCategory).toArray(),
            collection.aggregate(pipelineTopProducts).toArray(),
            collection.aggregate(pipelineBrandStats).toArray()
        ]);

        // Envoi de la réponse consolidée
        res.json({
            status: "success",
            data: {
                statsByCategory,
                topProducts,
                brandStats
            }
        });

    } catch (error) {
        console.error("Erreur stats:", error);
        res.status(500).json({ error: "Erreur lors du calcul des statistiques" });
    }
}); 

// Route: GET /api/products
router.get('/', async (req, res) => {
    try {
        // 1. Extraction des paramètres (avec valeurs par défaut)
        // On convertit page et limit en entiers car req.query renvoie des strings
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const search = req.query.search;
        const sortParam = req.query.sort;

        // 2. Construction du filtre (Query MongoDB)
        let query = {};

        // Filtrage par catégorie (si présente)
        if (category) {
            query.category = category;
        }

        // Recherche textuelle (si search est présent)
        // On cherche dans le titre OU la description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },      // 'i' pour insensible à la casse
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // 3. Gestion du Tri
        let sortOptions = {};
        if (sortParam) {
            // Si le paramètre commence par un tiret (ex: -price), on trie en décroissant
            if (sortParam.startsWith('-')) {
                const field = sortParam.substring(1); // on enlève le '-'
                sortOptions[field] = -1;
            } else {
                sortOptions[sortParam] = 1;
            }
        } else {
            // Tri par défaut (facultatif)
            sortOptions = { _id: 1 }; 
        }

        // 4. Calcul de la pagination
        const skip = (page - 1) * limit;

        // 5. Exécution des requêtes MongoDB
        const collection = req.db.collection('products');

        // Requête A : Récupérer les données
        const products = await collection.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .toArray();

        // Requête B : Compter le total (pour le frontend)
        // Important : on utilise le même filtre 'query' pour compter
        const total = await collection.countDocuments(query);

        // 6. Envoi de la réponse
        res.status(200).json({
            page: page,
            limit: limit,
            totalResults: total,
            totalPages: Math.ceil(total / limit),
            data: products
        });

    } catch (error) {
        console.error("Erreur route produits:", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des produits" });
    }
});

module.exports = router;
