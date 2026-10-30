import { text, caseSensitive } from './helper';
import { expect, test } from './test';

test.describe('Start view', () => {
  test.beforeEach(({ page }) => page.goto('/start'));

  test('shows the archive cards and browse view', async ({ page }) => {
    await expect(page.locator('.archives')).toBeVisible();
    await expect(page.getByTestId('archive').first()).toBeVisible();
    await expect(page.locator('.browse-container')).toBeVisible();
  });

  test('shows the picture count for the archive cards', async ({ page }) => {
    await expect(
      page.locator('[data-testid="archive"]', {
        hasText: caseSensitive('Herbert-Ahrens-Bilderarchiv'),
      })
    ).toContainText('5 Bilder');
  });

  test('should have a visible navigation bar', async ({ page }) => {
    await expect(page.locator('.nav-bar')).toBeVisible();
  });

  test('should contain child collections', async ({ page }) => {
    await expect(page.locator('.collection-picture-display .item').first()).toBeVisible();
  });

  test('should have selectable custom overview', async ({ page }) => {
    await text(page.locator('.overview-selection-container'), 'Neuzugänge').click();
  });

  test('should show a picture preview', async ({ page }) => {
    await expect(page.locator('.picture-grid img').first()).toBeVisible();
  });

  test('should direct the user to child collections when clicking on them', async ({ page }) => {
    await page
      .getByText(/^collection 1$/i)
      .first()
      .click();
    await expect(page).toHaveURL(/\/Collection_1/);
  });

  test('should open a picture view after clicking on a picture preview and closing it afterwards', async ({
    page,
  }) => {
    await page
      .getByText(/^collection 1$/i)
      .first()
      .click();
    await expect(page).toHaveURL(/\/Collection_1/);
    await page.locator('.picture-grid .picture-preview').first().click();
    await expect(page).toHaveURL(/\/picture\//);
    await expect(page.locator('.picture-toolbar')).toBeVisible();
    await page.locator('.picture-toolbar button').first().click();
    await expect(page).toHaveURL(/\/Collection_1/);
    await expect(page.locator('.picture-toolbar')).toHaveCount(0);
  });
});
