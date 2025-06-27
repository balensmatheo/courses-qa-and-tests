import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// --- Mocks ---
vi.mock('./transfer.repository.js', () => ({
    createTransferInRepository: vi.fn(),
    getTransfersFromRepository: vi.fn(),
}));

// Remplacer par le account repository
vi.mock('../account/account.service.js', () => ({
    getAccountById: vi.fn(),
    patchAccount: vi.fn(),
}));

// --- Imports ---
import { createTransfer, getTransfers } from './transfer.service.js';
import { createTransferInRepository, getTransfersFromRepository } from './transfer.repository.js';
import { getAccountById, patchAccount } from '../account/account.service.js';

// --- Suite de Tests pour le Service Transfer ---
describe('Banking Transfer Service', () => {
    beforeEach(() => { vi.clearAllMocks(); });
    afterEach(() => { vi.restoreAllMocks(); });

    describe('createTransfer', () => {
        it('should create a transfer and update account balances successfully', async () => {
            // 1. Arrange
            const transferInput = { fromAccountId: 101, toAccountId: 102, amount: 100 };
            const fromAccount = { id: 101, userId: 1, amount: 500, currency: 'EUR' };
            const toAccount = { id: 102, userId: 2, amount: 1000, currency: 'EUR' };

            // On configure le mock pour qu'il retourne le bon compte selon l'ID demandé
            getAccountById.mockImplementation((accountId) => {
                if (accountId === fromAccount.id) return Promise.resolve(fromAccount);
                if (accountId === toAccount.id) return Promise.resolve(toAccount);
                return Promise.resolve(null);
            });

            const fakeTransfer = { id: 1, ...transferInput, createdAt: new Date() };
            createTransferInRepository.mockResolvedValue(fakeTransfer);

            // 2. Act
            const result = await createTransfer(transferInput);

            // 3. Assert
            expect(result).toEqual(fakeTransfer);
            expect(patchAccount).toHaveBeenCalledTimes(2);
            // CORRECTION: On vérifie la propriété 'amount' et non 'balance'
            expect(patchAccount).toHaveBeenCalledWith(fromAccount.id, { amount: 400 });
            expect(patchAccount).toHaveBeenCalledWith(toAccount.id, { amount: 1100 });
        });

        it('should throw an error for insufficient funds', async () => {
            // 1. Arrange
            const transferInput = { fromAccountId: 101, toAccountId: 102, amount: 600 };
            const fromAccount = { id: 101, userId: 1, amount: 500, currency: 'EUR' };

            // CORRECTION: On s'assure que le mock retourne bien le compte pour CE test
            getAccountById.mockResolvedValue(fromAccount);

            // 2. Act & Assert
            await expect(() => createTransfer(transferInput)).rejects.toMatchObject({
                name: 'HttpBadRequest',
                message: 'Insufficient funds'
            });
            expect(createTransferInRepository).not.toHaveBeenCalled();
            expect(patchAccount).not.toHaveBeenCalled();
        });
    });

    describe('getTransfers', () => {
        it('should get all transfers for a user', async () => {
            const userId = 1;
            const fakeTransfers = [{ id: 1, fromAccountId: 101, toAccountId: 102, amount: 100 }];
            getTransfersFromRepository.mockResolvedValue(fakeTransfers);
            const transfers = await getTransfers(userId);
            expect(transfers).toEqual(fakeTransfers);
            expect(getTransfersFromRepository).toHaveBeenCalledOnce();
        });
    });
});
