import pg from 'pg';

const { Pool } = pg;

// TODO: Remplacez ces valeurs par celles de votre configuration Docker/BDD
const pool = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432, // Le port exposé par votre conteneur Docker
});

export const db = {
    query: (text, params) => pool.query(text, params),
};

export const connect = async () => {
    try {
        await pool.connect();
        console.log("Connecté à la base de données d'intégration.");
    } catch (error) {
        console.error("Erreur de connexion à la base de données :", error);
    }
};

export const disconnect = async () => {
    await pool.end();
    console.log("Déconnecté de la base de données.");
};
