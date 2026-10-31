import { type Page } from '@playwright/test';
import { expectNoText, expectText, scrollToBottom, step } from './helper';
import { expect, test } from './test';

const search = async (page: Page, value: string) => {
  await page.goto('/search');
  const input = page.getByRole('textbox', {
    name: 'In allen Bildinformationen suchen',
    exact: true,
  });
  await input.fill(value);
  await input.press('Enter');
};

test.describe('Deleting a picture', () => {
  test.use({ curator: true });

  test('hides it everywhere', async ({ page }) => {
    const description = 'Yet another description';
    const preview = page.locator('#picture-preview-for-1');

    await step('the picture is shown before', async () => {
      await page.goto('/picture/1');
      await expectText(page, description);
    });

    await step('delete it from the search results', async () => {
      await search(page, description);
      await preview.getByTitle('Bild entfernen', { exact: true }).click();
      await page.getByRole('button', { name: 'Bestätigen', exact: true }).click();
      await expect(preview).toHaveCount(0);
    });

    await step('the start page counts one picture less', async () => {
      await page.goto('/start');
      await expect(page.locator('.picture-count')).toContainText('Mehr als 100 Bilder');
      await scrollToBottom(page);
      await expect(page.locator('.picture-count')).toContainText('106 Bilder');
      await expect(preview).toHaveCount(0);
    });

    await step('its page shows nothing', async () => {
      await page.goto('/picture/1');
      await expect(page.locator('.picture-sidebar')).toBeVisible();
      await expectNoText(page, description);
    });

    await step('the search no longer finds it', async () => {
      // The search index is updated after the mutation returns
      await expect(async () => {
        await search(page, description);
        await expect(page.locator('.picture-count')).toBeVisible();
        await expect(preview).toHaveCount(0);
      }).toPass({ timeout: 15_000 });
    });
  });
});
