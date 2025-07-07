// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Page d\'inscription', () => {
	test('doit permettre à un utilisateur de s\'inscrire avec succès', async ({ page }) => {
		// 1. Visiter la page. La baseURL est déjà configurée dans playwright.config.ts.
		await page.goto('/');

		// 2. Définir les données de test
		const username = 'SvelteFan';
		const email = `test-${Date.now()}@svelte.dev`;
		const password = 'superSecretPassword!';

		// 3. Remplir les champs du formulaire en utilisant les labels
		await page.getByLabel("Nom d'utilisateur").fill(username);
		await page.getByLabel('Adresse E-mail').fill(email);
		await page.getByLabel('Mot de passe').fill(password);

		// 4. Cliquer sur le bouton d'inscription
		await page.getByRole('button', { name: "S'inscrire" }).click();

		// 5. Vérifier que le message de succès s'affiche correctement
		const successMessage = page.locator('#message-container');
		await expect(successMessage).toBeVisible();
		await expect(successMessage).toHaveText(`Bienvenue, ${username} ! Votre compte a été créé.`);
	});
});