import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db, connect, disconnect } from '../../db/index.js'; // On suppose un helper pour la BDD
import { createTransfer } from '../transfer/transfer.service.js';
import { getAccountById } from './account.service.js';

describe('Banking Integration Test', () => {

    // Avant tous les tests de cette suite, on se connecte à la BDD
    // et on la prépare avec des données propres.
    beforeAll(async () => {
        await connect();
        // On vide les tables pour s'assurer que le test est propre et répétable
        await db.query('TRUNCATE transfers, accounts, users RESTART IDENTITY CASCADE;');
        // On insère des données de test
        await db.query(`
      INSERT INTO users (name, birthday) VALUES ('User A', '2000-01-01'), ('User B', '2000-01-02');
      INSERT INTO accounts (userId, amount, currency) VALUES (1, 1000, 'EUR'), (2, 500, 'EUR');
    `);
    });

    // Après tous les tests, on ferme la connexion à la BDD
    afterAll(async () => {
        await disconnect();
    });

    it('should correctly perform a transfer between two accounts', async () => {
        // 1. Arrange
        const initialFromAccount = await getAccountById(1);
        const initialToAccount = await getAccountById(2);

        expect(initialFromAccount.amount).toBe(1000);
        expect(initialToAccount.amount).toBe(500);

        const transferDetails = {
            fromAccountId: 1,
            toAccountId: 2,
            amount: 200,
        };

        // 2. Act
        // On appelle le service qui va interagir avec la vraie BDD
        const newTransfer = await createTransfer(transferDetails);

        // 3. Assert
        expect(newTransfer).toBeDefined();
        expect(newTransfer.amount).toBe(200);

        // On vérifie que les soldes ont bien été mis à jour en BDD
        const finalFromAccount = await getAccountById(1);
        const finalToAccount = await getAccountById(2);

        expect(finalFromAccount.amount).toBe(800); // 1000 - 200
        expect(finalToAccount.amount).toBe(700); // 500 + 200

        // On vérifie que le virement a bien été enregistré
        const result = await db.query('SELECT * FROM transfers WHERE id = $1', [newTransfer.id]);
        expect(result.rows.length).toBe(1);
        expect(result.rows[0].amount).toBe(200);
    });
});
