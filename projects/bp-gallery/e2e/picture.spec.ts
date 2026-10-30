import { expectText } from './helper';
import { expect, test } from './test';

test.describe('Picture View called via link', () => {
  test.beforeEach(({ page }) => page.goto('/picture/1'));

  test('should display a toolbar', async ({ page }) => {
    await expect(page.locator('.picture-toolbar')).toBeVisible();
  });

  test('should show picture information after opening the sidebar', async ({ page }) => {
    await expect(page.locator('.picture-sidebar')).toBeVisible();
    await expectText(page, 'Bad Harzburg');
    await page.locator('.picture-sidebar .quick-access-buttons').click();
    await expect(page.locator('.picture-sidebar')).toHaveClass(/\bclosed\b/);
  });

  test('should return to the homepage when pressing the back button', async ({ page }) => {
    await page.locator('.picture-toolbar button').first().click();
    await expect(page).toHaveURL('/start');
  });
});

test.describe('Picture View called via link as a curator', () => {
  test.use({ curator: true });
  test.beforeEach(({ page }) => page.goto('/picture/1'));

  test('should show a picture-info-field for each type in the picture sidebar', async ({
    page,
  }) => {
    const pictureInfoFields = [
      'date',
      'description',
      'person',
      'location',
      'keywords',
      'links',
      'collections',
      'archive',
    ];

    await expect(page.locator('.picture-sidebar .quick-access-buttons')).toContainText('Vollbild');
    await expect(page.locator('.picture-info-field')).toHaveCount(pictureInfoFields.length);
  });

  test('should have date estimate functionality', async ({ page }) => {
    const checkbox = page.locator('.date-range-picker .MuiCheckbox-root');
    await page.locator('.date-indicator').click();
    await expect(checkbox).not.toHaveClass(/Mui-checked/);
    await checkbox.click();
    await expect(checkbox).toHaveClass(/Mui-checked/);
    await checkbox.click();
    await expect(checkbox).not.toHaveClass(/Mui-checked/);
    await page.keyboard.press('Escape');
  });
});

test('the like button counts a like and takes it back', async ({ page }) => {
  await page.goto('/picture/1');
  const like = page.getByRole('button', { name: /Mag ich$/ });
  await expect(like).toContainText('0');
  await like.click();
  await expect(like).toContainText('1');
  await page.reload();
  await expect(like).toContainText('1');
  await like.click();
  await expect(like).toContainText('0');
  await page.reload();
  await expect(like).toContainText('0');
});
