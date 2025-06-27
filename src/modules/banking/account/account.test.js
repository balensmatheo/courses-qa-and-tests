import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// --- Mocks ---
// On simule le comportement du module repository pour isoler notre service.
vi.mock('./account.repository.js', () => ({
    createAccountInRepository: vi.fn(),
    getAccountsFromRepository: vi.fn(),
    deleteAccountFromRepository: vi.fn(),
    patchAccountInRepository: vi.fn(),
}));

// --- Imports ---
// On importe les fonctions du service que nous allons tester.
// **CORRECTION : L'import de 'transfer.service.js' a été supprimé.**
import { createAccount, getAccounts, deleteAccount, patchAccount } from './account.service.js';
// On importe les fonctions mockées pour pouvoir les contrôler dans nos tests.
import {
    createAccountInRepository,
    getAccountsFromRepository,
    deleteAccountFromRepository,
    patchAccountInRepository,
} from './account.repository.js';

// --- Suite de Tests pour le Service Account ---
describe('Banking Account Service', () => {
    // On réinitialise les mocks avant chaque test.
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // On restaure l'état original des mocks après chaque test.
    afterEach(() => {
        vi.restoreAllMocks();
    });

    // --- Tests pour la fonction createAccount ---
    describe('createAccount', () => {
        it('should create a new account with valid input', async () => {
            const input = { userId: 1, amount: 1000, currency: 'EUR' };
            const fakeAccount = { id: 101, ...input, createdAt: new Date() };
            createAccountInRepository.mockResolvedValue(fakeAccount);
            const newAccount = await createAccount(input);
            expect(newAccount).toEqual(fakeAccount);
            expect(createAccountInRepository).toHaveBeenCalledOnce();
        });
    });

    // --- Tests pour la fonction getAccounts ---
    describe('getAccounts', () => {
        it('should get all accounts for a user', async () => {
            const userId = 1;
            const fakeAccounts = [{ id: 101, userId, amount: 1000, currency: 'EUR' }];
            getAccountsFromRepository.mockResolvedValue(fakeAccounts);
            const accounts = await getAccounts(userId);
            expect(accounts).toEqual(fakeAccounts);
            expect(getAccountsFromRepository).toHaveBeenCalledOnce();
        });
    });

    // --- Tests pour la fonction deleteAccount ---
    describe('deleteAccount', () => {
        it('should delete an account successfully', async () => {
            const userId = 1;
            const accountId = 101;
            deleteAccountFromRepository.mockResolvedValue({ success: true });
            const result = await deleteAccount(userId, accountId);
            expect(result).toEqual({ success: true });
            expect(deleteAccountFromRepository).toHaveBeenCalledOnce();
        });
    });

    // --- Tests pour la fonction patchAccount ---
    describe('patchAccount', () => {
        it('should update an account balance', async () => {
            const accountId = 101;
            const dataToUpdate = { amount: 1500 };
            const updatedAccount = { id: 101, userId: 1, amount: 1500, currency: 'EUR' };
            patchAccountInRepository.mockResolvedValue(updatedAccount);
            const result = await patchAccount(accountId, dataToUpdate);
            expect(result).toEqual(updatedAccount);
            expect(patchAccountInRepository).toHaveBeenCalledOnce();
        });
    });
});

// Rajouter des tests qui échouent automatiquement

