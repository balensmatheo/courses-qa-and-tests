import test, { expect, Page } from "@playwright/test";

async function acceptCookies(page: Page) {
    // On localise le bouton "Accepter les cookies" et on clique dessus
    const acceptCookiesButton = page.getByRole("button", { name: "Consent" });

    // On vérifie si le bouton est visible avant de cliquer
    if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
    }
}

test.describe("Ecommerce's product page", () => {
    // Avant chaque test, on va sur la page d'accueil du site ecommerce
    // et on accepte les cookies
    test.beforeEach(async ({ page }) => {
        // On va sur la page d'accueil du site ecommerce
        await page.goto("https://automationexercise.com/");
        await acceptCookies(page);
    });

    test("should go to product page", async ({ page }) => {
        // Ceci est un Locator, il permet de localiser un élément de la page
        // https://playwright.dev/docs/api/class-framelocator#frame-locator-get-by-label
        // Ici nous localisons le lien vers la page products.
        await page.getByRole("link", { name: " Products" }).click();

        // On vérifie que l'URL de la page est bien celle de la page des produits
        expect(page).toHaveURL("https://automationexercise.com/products");
        // On vérifie que le titre de la page est bien celui de la page des produits
        expect(await page.title()).toBe("Automation Exercise - All Products");
    });

    test("should find a t-shirt", async ({ page }) => {
        await page.getByRole("link", { name: " Products" }).click();

        // On écrit dans la barre de recherche le mot "t-shirt"
        await page.getByRole("textbox", { name: "Search Product" }).fill("t-shirt");

        // On clique sur le bouton de recherche
        await page.getByRole("button", { name: "" }).click();

        // On vérifie qu'il n'y a que 3 produits affichés
        const products = page.locator(".features_items .product-image-wrapper");

        // On vérifie que le nombre de produits affichés est bien de 3
        await expect(products).toHaveCount(3);
    });

    test("should contains product's details like title and price", async ({
                                                                              page,
                                                                          }) => {
        await page.goto("https://automationexercise.com/product_details/30");

        // On vérifie que le titre de la page est bien celle du produit
        expect(await page.title()).toBe("Automation Exercise - Product Details");
        // On vérifie que le titre du produit est bien celui attendu
        await expect(
            page.getByRole("heading", {name: "Premium Polo T-Shirts"})
        ).toBeVisible();
        // On vérifie que le prix du produit est bien présent
        await expect(page.getByText("Rs.")).toBeVisible();
        // On vérifie que le bouton "Add to cart" est bien visible
        await expect(page.getByRole("button", {name: " Add to cart"})).toBeVisible();
    });
});

test.describe("Parcours d'ajout au panier et vérification", () => {

    test("doit ajouter un produit et vérifier ses informations dans le panier", async ({ page }) => {

        // Étape 1 : Naviguer vers la page d'un produit spécifique.
        await page.goto('https://automationexercise.com/product_details/2');

        // ÉTAPE CRUCIALE AJOUTÉE : Gérer la bannière de consentement.
        // Cette bannière peut parfois apparaître et bloquer toutes les autres interactions.
        // On la ferme avant de continuer.
        const consentButton = page.getByRole('button', { name: 'Consent' });

        // On vérifie si le bouton est visible avant de cliquer, pour éviter une erreur
        // si la bannière n'apparaît pas (par exemple lors de runs suivants).
        if (await consentButton.isVisible()) {
            await consentButton.click();
        }

        // --- Le reste de votre test reste inchangé ---

        // Étape 2 : Récupérer les informations du produit.
        const productName = await page.locator('div.product-information h2').textContent();
        const productPrice = await page.locator('div.product-information span span').textContent();
        const expectedQuantity = '1';

        expect(productName).not.toBeNull();
        expect(productPrice).not.toBeNull();

        // Étape 3 : Ajouter le produit au panier.
        // Ce clic devrait maintenant fonctionner sans problème.
        await page.getByRole('button', { name: 'Add to cart' }).click();

        // Étape 4 : Gérer la modale de confirmation et naviguer vers le panier.
        await page.getByRole('link', { name: 'View Cart' }).click();

        await expect(page).toHaveURL('https://automationexercise.com/view_cart');

        // Étape 5 : Vérifier les informations du produit dans le tableau du panier.
        const cartRow = page.locator('#product-2');
        await expect(cartRow.locator('.cart_description a')).toHaveText(productName!);
        await expect(cartRow.locator('.cart_price p')).toHaveText(productPrice!);
        await expect(cartRow.locator('.cart_quantity .disabled')).toHaveText(expectedQuantity);
        await expect(cartRow.locator('.cart_total p.cart_total_price')).toHaveText(productPrice!);
    });
});
