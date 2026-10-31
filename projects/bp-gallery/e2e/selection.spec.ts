import { type Page } from '@playwright/test';
import { clickBulkOperation, scrollToBottom } from './helper';
import { expect, test } from './test';

test.describe('selection', () => {
  test.use({ curator: true });

  const selectButtons = (page: Page) =>
    page.locator('.picture-preview').getByTitle('Bild auswählen', { exact: true });
  const checkBox = (page: Page, index: number) =>
    page.locator('.picture-preview').nth(index).getByTestId('CheckBoxIcon');

  test('select multiple photos manually', async ({ page }) => {
    await page.goto('/latest/');
    for (const index of [0, 1, 2]) {
      await selectButtons(page).nth(index).click();
    }
    for (const index of [0, 1, 2]) {
      await expect(checkBox(page, index)).toBeVisible();
    }
    await clickBulkOperation(page, 'Keine auswählen');
    await expect(
      page.locator('.picture-preview .adornment [data-testid="CheckBoxIcon"]')
    ).toHaveCount(0);
  });

  test('selection is preserved while scrolling', async ({ page }) => {
    await page.goto('/latest/');
    await selectButtons(page).nth(0).click();
    await selectButtons(page).nth(1).click();
    await scrollToBottom(page);
    await expect(checkBox(page, 0)).toBeVisible();
    await expect(checkBox(page, 1)).toBeVisible();
  });
});
