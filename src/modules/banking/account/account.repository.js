import { sql } from '../../../infrastructure/db.js';

/**
 * Crée un compte en base de données.
 */
export const createAccountInRepository = async (accountData) => {
    // CORRECTION : On retire la 'currency'
    const { userId, amount } = accountData;
    const result = await sql`
    INSERT INTO accounts(userId, amount) 
    VALUES(${userId}, ${amount}) 
    RETURNING *`;
    return result[0];
};

/**
 * Récupère tous les comptes d'un utilisateur depuis la base de données.
 */
export const getAccountsFromRepository = async (userId) => {
    const result = await sql`
    SELECT * FROM accounts WHERE userId = ${userId}`;
    return result;
};

/**
 * Récupère un compte par son ID depuis la base de données.
 */
export const getAccountByIdFromRepository = async (accountId) => {
    const result = await sql`
    SELECT * FROM accounts WHERE id = ${accountId}`;
    return result[0];
};

/**
 * Supprime un compte de la base de données.
 */
export const deleteAccountFromRepository = async (userId, accountId) => {
    await sql`
      DELETE FROM accounts WHERE id = ${accountId} AND userId = ${userId}`;
    return { success: true };
};

/**
 * Met à jour le solde d'un compte en base de données.
 */
export const patchAccountInRepository = async (accountId, dataToUpdate) => {
    const { amount } = dataToUpdate;
    const result = await sql`
    UPDATE accounts SET amount = ${amount} WHERE id = ${accountId} RETURNING *`;
    return result[0];
};
