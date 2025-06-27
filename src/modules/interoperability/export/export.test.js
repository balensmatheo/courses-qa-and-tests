import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import xlsx from 'node-xlsx';

// --- Mocks ---
// On mock la méthode `build` de la librairie node-xlsx
vi.mock('node-xlsx', () => ({
    default: { // 'node-xlsx' utilise un export par défaut
        build: vi.fn(),
    },
}));

// On mock le service qui nous fournit les données des virements
vi.mock('../banking/transfer.service.js', () => ({
    getTransfers: vi.fn(),
}));

// CORRECTION : On mock 'fs' de manière plus simple pour éviter l'erreur de hoisting.
// Comme notre code n'utilise que `fs.writeFileSync`, nous n'avons besoin de mocker que cette partie.
vi.mock('fs', () => ({
    default: {
        writeFileSync: vi.fn(),
    },
}));

// --- Imports ---
import { createExport } from './export.service.js';
import { getTransfers } from '../banking/transfer.service.js';

describe('Export Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('createExport', () => {
        it('should fetch transfers and build an xlsx file', async () => {
            // 1. Arrange
            const userId = 1;
            const accountId = 101;
            const fakeTransfers = [
                { id: 1, fromAccountId: 101, toAccountId: 102, amount: 100.50 },
                { id: 2, fromAccountId: 201, toAccountId: 101, amount: 50.25 },
            ];
            // On configure le mock pour retourner nos faux virements
            getTransfers.mockResolvedValue(fakeTransfers);

            // On prépare le buffer que le mock de xlsx.build doit retourner
            const fakeBuffer = Buffer.from('ceci est un faux fichier xlsx');
            xlsx.build.mockReturnValue(fakeBuffer);

            // 2. Act
            const filePath = await createExport(userId, accountId);

            // 3. Assert
            // Vérifier que les virements ont bien été demandés
            expect(getTransfers).toHaveBeenCalledOnce();
            expect(getTransfers).toHaveBeenCalledWith(userId);

            // Vérifier que la librairie xlsx a été appelée avec les bonnes données formatées
            const expectedSheetData = [
                ['ID du Virement', 'Compte Source', 'Compte Destination', 'Montant'],
                [1, 101, 102, 100.50],
                [2, 201, 101, 50.25],
            ];
            expect(xlsx.build).toHaveBeenCalledOnce();
            expect(xlsx.build).toHaveBeenCalledWith([{ name: 'Transfers', data: expectedSheetData, options: {} }]);

            // Vérifier que le fichier a été écrit au bon endroit avec le bon contenu
            const expectedFilePath = `export-account-${accountId}.xlsx`;
            expect(fs.writeFileSync).toHaveBeenCalledOnce();
            expect(fs.writeFileSync).toHaveBeenCalledWith(expectedFilePath, fakeBuffer);

            // Vérifier que la fonction retourne bien le chemin du fichier créé
            expect(filePath).toBe(expectedFilePath);
        });
    });
});
