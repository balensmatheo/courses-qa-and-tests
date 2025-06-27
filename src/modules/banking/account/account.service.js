import {
    createAccountInRepository,
    deleteAccountFromRepository,
    getAccountByIdFromRepository,
    getAccountsFromRepository,
    patchAccountInRepository,
} from '../account/account.repository.js';

// --- Service Implementation ---

/**
 * Crée un nouveau compte bancaire.
 * @param {object} accountData - Les données du compte à créer.
 * @returns {Promise<object>} Le compte nouvellement créé.
 */
export const createAccount = async (accountData) => {
    // En situation réelle, on ajouterait ici une validation des données (ex: devise valide, etc.)
    const newAccount = await createAccountInRepository(accountData);
    return newAccount;
};

/**
 * Récupère tous les comptes d'un utilisateur.
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Array<object>>} La liste des comptes.
 */
export const getAccounts = async (userId) => {
    const accounts = await getAccountsFromRepository(userId);
    return accounts;
};

/**
 * Récupère un compte par son ID.
 * @param {number} accountId - L'ID du compte.
 * @returns {Promise<object>} Le compte trouvé.
 */
export const getAccountById = async (accountId) => {
    const account = await getAccountByIdFromRepository(accountId);
    return account;
};

/**
 * Supprime un compte bancaire.
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {number} accountId - L'ID du compte à supprimer.
 * @returns {Promise<object>} Un objet confirmant le succès.
 */
export const deleteAccount = async (userId, accountId) => {
    const result = await deleteAccountFromRepository(userId, accountId);
    return result;
};

/**
 * Met à jour partiellement un compte (ex: le solde).
 * @param {number} accountId - L'ID du compte à mettre à jour.
 * @param {object} dataToUpdate - Les données à mettre à jour.
 * @returns {Promise<object>} Le compte mis à jour.
 */
export const patchAccount = async (accountId, dataToUpdate) => {
    const updatedAccount = await patchAccountInRepository(accountId, dataToUpdate);
    return updatedAccount;
};
