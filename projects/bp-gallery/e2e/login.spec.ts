import { type Page } from '@playwright/test';
import { caseSensitive, submitLogin } from './helper';
import { expect, test } from './test';

const openLogin = (page: Page) =>
  page.locator('.nav-bar').getByText('Login', { exact: true }).click();

test.describe('Login', () => {
  test.beforeEach(({ page }) => page.goto('/'));

  test('should display a login button in the navigation bar which opens a dialog when clicked', async ({
    page,
  }) => {
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await openLogin(page);
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should show an error when entering invalid login data', async ({ page }) => {
    await openLogin(page);
    await submitLogin(page, 'Wrong data', 'Wrong data');
    await expect(page.getByRole('dialog').getByRole('alert')).toBeVisible();
  });

  test('should close the dialog on successful login', async ({ page }) => {
    await openLogin(page);
    await submitLogin(page, 'testCurator', '1234abc');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

test.describe('Logged in', () => {
  test.use({ curator: true });
  test.beforeEach(({ page }) => page.goto('/'));

  test('should show the closed Mehr... menu', async ({ page }) => {
    const menu = page.locator('.nav-more-menu .MuiMenu-paper');
    await expect(page.locator('.nav-element', { hasText: caseSensitive('Mehr...') })).toBeVisible();
    await expect(menu).toBeHidden();
    await page.locator('.nav-element', { hasText: caseSensitive('Mehr...') }).click();
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });

  test('should show the upload-area', async ({ page }) => {
    await expect(page.locator('.upload-area')).toBeAttached();
  });
});
