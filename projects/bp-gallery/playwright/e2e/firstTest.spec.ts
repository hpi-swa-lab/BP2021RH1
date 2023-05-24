import { expect, test } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto("/")
})

test.describe("first tests", () => {
    test ('has correct title', async ({page}) => {
        await expect(page).toHaveTitle(/Das Herbert-Ahrens-Bilderarchiv/);
    });
    
    test ("navigates to search", async ({page}) => {
        await page.getByRole("link", {name: "Suchen"}).click();
        await expect(page).toHaveURL(/.*search/);
    })
})
