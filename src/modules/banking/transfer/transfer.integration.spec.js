import { describe, it, expect, beforeAll } from 'vitest';
import { sql } from '../../../infrastructure/db.js'; // On importe l'objet 'sql'
import { createTransfer } from './transfer.service.js';
import { getAccountById } from '../account/account.service.js';

describe('Banking Integration Test', () => {

    // Ce bloc prépare la base de données avant les tests
    beforeAll(async () => {
        await sql`TRUNCATE transfers, accounts, users RESTART IDENTITY CASCADE;`;
        await sql`
      INSERT INTO users (name, birthday) VALUES ('User A', '2000-01-01'), ('User B', '2000-01-02');
    `;
        // CORRECTION : On retire la colonne 'currency' qui n'existe pas dans le schéma
        await sql`
      INSERT INTO accounts (userId, amount) VALUES (1, 1000), (2, 500);
    `;
    });

    it('should correctly perform a transfer between two accounts', async () => {
        // 1. Arrange
        const initialFromAccount = await getAccountById(1);
        const initialToAccount = await getAccountById(2);

        expect(initialFromAccount, "Le compte source (ID 1) n'a pas été trouvé.").toBeDefined();
        expect(initialToAccount, "Le compte destination (ID 2) n'a pas été trouvé.").toBeDefined();

        expect(initialFromAccount.amount).toBe(1000);
        expect(initialToAccount.amount).toBe(500);

        const transferDetails = {
            fromAccountId: 1,
            toAccountId: 2,
            amount: 200,
        };

        // 2. Act
        const newTransfer = await createTransfer(transferDetails);

        // 3. Assert
        expect(newTransfer, "createTransfer n'a rien retourné.").toBeDefined();
        expect(newTransfer.amount).toBe(200);

        const finalFromAccount = await getAccountById(1);
        const finalToAccount = await getAccountById(2);

        expect(finalFromAccount.amount).toBe(800); // 1000 - 200
        expect(finalToAccount.amount).toBe(700); // 500 + 200

        const result = await sql`SELECT * FROM transfers WHERE id = ${newTransfer.id}`;
        expect(result.length).toBe(1);
        expect(result[0].amount).toBe(200);
    });
});
