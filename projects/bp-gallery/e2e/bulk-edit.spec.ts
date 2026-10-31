import { addTag, bulkEdit } from './helper';
import { expect, test } from './test';

test.describe('bulk edit', () => {
  test.use({ curator: true });

  test('deselect all if and only if something was changed', async ({ page }) => {
    await page.goto('/latest/');
    const selectButtons = page
      .locator('.picture-preview')
      .getByTitle('Bild auswählen', { exact: true });
    await selectButtons.nth(0).click();
    await selectButtons.nth(1).click();
    await bulkEdit(page);
    await page.getByText('Zurück', { exact: true }).click();
    await expect(selectButtons.nth(0).getByTestId('CheckBoxIcon')).toBeVisible();
    await expect(selectButtons.nth(1).getByTestId('CheckBoxIcon')).toBeVisible();
    await bulkEdit(page);
    await addTag(page, 'Personen', 'Simon', 'Simon Heraldson');
    await page.getByText('Zurück', { exact: true }).click();
    await expect(
      page.locator('.picture-preview .adornment [data-testid="CheckBoxIcon"]')
    ).toHaveCount(0);
  });
});
