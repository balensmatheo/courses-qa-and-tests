import { sql } from '../../../infrastructure/db.js';

export const createTransferInRepository = async (transferData) => {
    const { fromAccountId, toAccountId, amount } = transferData;
    const result = await sql`
    INSERT INTO transfers (sourceAccountId, destAccountId, amount)
    VALUES (${fromAccountId}, ${toAccountId}, ${amount})
    RETURNING *`;
    return result[0];
};

export const getTransfersFromRepository = async (userId) => {
    // Cette requête récupère les virements où l'utilisateur est soit la source, soit la destination.
    const result = await sql`
    SELECT t.* FROM transfers t
    JOIN accounts a ON a.id = t.sourceAccountId OR a.id = t.destAccountId
    WHERE a.userId = ${userId}`;

    // On s'assure de ne pas avoir de doublons si l'utilisateur s'est fait un virement à lui-même
    const uniqueTransfers = [...new Map(result.map(item => [item.id, item])).values()];
    return uniqueTransfers;
};
