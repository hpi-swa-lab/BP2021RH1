import { type Page } from '@playwright/test';
import { expectText, scrollToBottom, waitForAllImagesLoaded } from './helper';
import { expect, test } from './test';

test.describe('Search', () => {
  const search = async (page: Page, value: string) => {
    await page.goto('/search');
    const input = page.getByRole('textbox', {
      name: 'In allen Bildinformationen suchen',
      exact: true,
    });
    await input.fill(value);
    await input.press('Enter');
  };

  test('shows more pictures after scrolling down', async ({ page }) => {
    const previews = page.locator('.picture-grid .picture-preview');
    await search(page, 'Top-Level');
    await expect(page.locator('.picture-count')).toHaveText('Mehr als 100 Bilder');
    await expect(previews).toHaveCount(100);
    await waitForAllImagesLoaded(page);
    await scrollToBottom(page);
    await expect(page.locator('.picture-count')).toHaveText('107 Bilder');
    await expect(previews).toHaveCount(107);
  });

  test('says when nothing matches', async ({ page }) => {
    await search(page, 'Fantasiewort');
    await expectText(page, 'Im Archiv gibt es leider keine Bilder');
    await expect(page.locator('.picture-count')).toHaveText('Keine Bilder');
    await expect(page.locator('.picture-grid .picture-preview')).toHaveCount(0);
  });

  test('is possible to like a picture in the search view', async ({ page }) => {
    // Few results, since a like re-indexes the picture, which can move it past the first 100
    await search(page, 'Yet another description');
    const like = page
      .locator('#picture-preview-for-1 [data-cy="preview-stats"]')
      .getByTitle('Mag ich', {
        exact: true,
      });
    await expect(like).toHaveText('0');
    await like.click();
    await expect(like).toHaveText('1');
    await page.reload();
    await expect(like).toHaveText('1');
    await like.click();
    await expect(like).toHaveText('0');
    await page.reload();
    await expect(like).toHaveText('0');
  });
});
