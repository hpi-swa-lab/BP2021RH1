import { expect, test } from './test';

test.describe('Strapi admin panel', () => {
  test('lists entries after logging in', async ({ page, stack }) => {
    await page.goto(`${stack.strapi}/admin/auth/login`);
    await page.locator('input[name="email"]').fill('dev@example.com');
    await page.locator('input[name="password"]').fill('Dev12345');
    await page.locator('button[type="submit"]').click();
    await expect(page).not.toHaveURL(/\/auth/);
    await page.goto(
      `${stack.strapi}/admin/content-manager/collectionType/api::keyword-tag.keyword-tag`
    );
    // The list has the name once more in a hidden tooltip
    await expect(
      page.locator('#main-content').getByText('Verifiziertes Testschlagwort 1', { exact: true })
    ).toBeVisible({ timeout: 30_000 });
  });
});
