import fs from 'fs';
import xlsx from 'node-xlsx';
import { getTransfers } from '../banking/transfer.service.js';

/**
 * Crée un fichier d'export (.xlsx) contenant les virements d'un utilisateur.
 * @param {number} userId - L'ID de l'utilisateur pour lequel récupérer les virements.
 * @param {number} accountId - L'ID du compte utilisé pour nommer le fichier.
 * @returns {Promise<string>} Le chemin du fichier généré.
 */
export const createExport = async (userId, accountId) => {
    // 1. Appeler le service `getTransfers` pour récupérer les données.
    const transfers = await getTransfers(userId);

    // 2. Formater les données pour `node-xlsx` (en-têtes + lignes).
    const dataForSheet = [
        // Ligne d'en-tête
        ['ID du Virement', 'Compte Source', 'Compte Destination', 'Montant'],
        // Lignes de données
        ...transfers.map(t => [t.id, t.fromAccountId, t.toAccountId, t.amount])
    ];

    const sheetOptions = {}; // Aucune option spécifique pour l'instant
    const sheet = { name: 'Transfers', data: dataForSheet, options: sheetOptions };

    // 3. Appeler `xlsx.build` avec les données formatées pour générer le buffer.
    const buffer = xlsx.build([sheet]);

    // 4. Définir un nom de fichier.
    const filePath = `export-account-${accountId}.xlsx`;

    // 5. Utiliser `fs.writeFileSync` pour écrire le buffer dans un fichier.
    fs.writeFileSync(filePath, buffer);

    // 6. Retourner le chemin du fichier créé.
    return filePath;
};
