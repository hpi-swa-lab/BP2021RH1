import { type Page } from '@playwright/test';
import { chip, infoField } from './helper';
import { expect, test } from './test';

test.describe('keyword table', () => {
  test.use({ curator: true });

  const nameCell = (page: Page, name: string) => page.getByRole('cell', { name, exact: true });
  const row = (page: Page, name: string) =>
    page.getByRole('row').filter({ has: nameCell(page, name) });

  const saved = (page: Page, operationName: string) =>
    page.waitForResponse(
      response =>
        response.url().endsWith('/graphql') &&
        (response.request().postDataJSON() as { operationName?: string }).operationName ===
          operationName
    );

  test('a rename shows on a picture opened before', async ({ page }) => {
    // Only in-app navigation, so the picture's info stays in the client's cache
    const grid = '/archives/1/show-more/pictures';
    const keywords = infoField(page, 'Schlagworte');
    await page.goto(grid);
    await page.locator('#picture-preview-for-1').first().click();
    await expect(chip(keywords, 'wine')).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(grid);

    await page.getByText('Mehr...', { exact: true }).click();
    await page.getByRole('menuitem', { name: 'Schlagworte', exact: true }).click();
    await expect(page).toHaveURL('/tags/keywords');
    await nameCell(page, 'wine').dblclick();
    await page.getByRole('grid').getByRole('textbox').fill('Wein');
    const renamed = saved(page, 'updateKeywordName');
    await page.keyboard.press('Enter');
    expect((await renamed).ok()).toBe(true);
    await expect(row(page, 'Wein')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(grid);
    await page.locator('#picture-preview-for-1').first().click();
    await expect(chip(keywords, 'Wein')).toBeVisible();
  });

  test('deletes one of two synonyms', async ({ page }) => {
    await page.goto('/tags/keywords');
    await expect(chip(row(page, 'picture'), 'image')).toBeVisible();
    const deleted = saved(page, 'updateKeywordSynonyms');
    await chip(row(page, 'picture'), 'bild').getByTestId('CancelIcon').click();
    expect((await deleted).ok()).toBe(true);

    await page.reload();
    await expect(chip(row(page, 'picture'), 'image')).toBeVisible();
    await expect(chip(row(page, 'picture'), 'bild')).toHaveCount(0);
  });
});
