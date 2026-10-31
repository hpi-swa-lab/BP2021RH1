import { scrollToBottom, waitForAllImagesLoaded } from './helper';
import { expect, test } from './test';

test.describe('picture grid', () => {
  test('should render more pictures after scrolling', async ({ page }) => {
    const previews = page.locator('.collection-picture-display .picture-grid .picture-preview');
    await page.goto('/start');
    await expect(page.locator('.picture-count')).toContainText('Mehr als 100 Bilder');
    await expect(previews).toHaveCount(100);
    await waitForAllImagesLoaded(page);

    await scrollToBottom(page);
    await expect(page.locator('.picture-count')).toContainText('107 Bilder');
    await expect(previews).toHaveCount(107);
  });

  test('has a working back button after navigating between pictures', async ({ page }) => {
    await page.goto('/archives/1');
    await page.locator('.overview-container .picture-preview').first().click();
    const next = page.locator('.picture-navigation-buttons [data-testid="next"]');
    for (let i = 0; i < 2; i++) {
      await expect(page).toHaveURL(/\/picture\//);
      const url = page.url();
      await next.click();
      await expect(page).not.toHaveURL(url);
    }
    await page.getByText('Zurück', { exact: true }).click();
    await expect(page).toHaveURL('/archives/1');
  });
});
