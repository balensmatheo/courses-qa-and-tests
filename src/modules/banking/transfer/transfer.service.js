import { getAccountById, patchAccount } from './account.service.js';
import { createTransferInRepository, getTransfersFromRepository } from './transfer.repository.js';

// --- Custom Error Classes ---
// En pratique, celles-ci seraient dans un fichier d'erreurs partagé.
class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

class HttpBadRequest extends HttpError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

// --- Service Implementation ---

export const createTransfer = async (transferData) => {
    const { fromAccountId, toAccountId, amount } = transferData;

    // Validation des paramètres
    if (!fromAccountId || !toAccountId || amount === undefined) {
        throw new HttpBadRequest('Missing parameters');
    }
    if (typeof amount !== 'number' || isNaN(amount)) {
        throw new HttpBadRequest('Invalid amount');
    }
    if (amount <= 0) {
        throw new HttpBadRequest('Amount cannot be negative');
    }

    // Récupération des comptes et validation de la logique métier
    const fromAccount = await getAccountById(fromAccountId);

    if (fromAccount.amount < amount) {
        throw new HttpBadRequest('Insufficient funds');
    }

    const toAccount = await getAccountById(toAccountId);

    // Mises à jour des soldes
    await patchAccount(fromAccountId, { amount: fromAccount.amount - amount });
    await patchAccount(toAccountId, { amount: toAccount.amount + amount });

    // Création de l'enregistrement du virement
    const newTransfer = await createTransferInRepository(transferData);

    // Très important : retourner le virement créé
    return newTransfer;
};

export const getTransfers = async (userId) => {
    // Simplement appeler le repository et retourner le résultat
    const transfers = await getTransfersFromRepository(userId);
    return transfers;
};
