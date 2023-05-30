import { expect, test } from '@playwright/test';
import { PlaywrightUtils } from './utils/playwright-utils';

test.describe('Comment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/picture/1');
  });

  test('adds a comment to picture 1', async ({ page }) => {
    await page.waitForSelector('input#name');
    // await expect(page.locator('input#name')).toBeVisible();
    await page.fill('input#name', 'Hans Hansen');
    await expect(page.locator('textarea#text')).toBeVisible();
    await page.fill('textarea#text', 'Testkommentar1');
    await page.getByRole("button", {name: 'Absenden'}).click();
    //await page.getByText("Absenden").click('.MuiButton-root:has-text("Absenden")')
    await expect(page.locator('.MuiDialog-container')).toContainText('Danke für Ihren Kommentar!');
    await page.getByText("O.K.").click();


    await expect(page.locator('input#name')).toBeVisible();
    await page.fill('input#name', 'Hans Hansen');
    await expect(page.locator('textarea#text')).toBeVisible();
    await page.fill('textarea#text', 'Testkommentar2');
    await page.getByRole("button", {name: 'Absenden'}).click();
    await expect(page.locator('.MuiDialog-container')).toContainText('Danke für Ihren Kommentar!');
    await page.getByText("O.K.").click();
  });

  test('log in as curator and curate the new comments', async ({ page }) => {
    const utils = new PlaywrightUtils(page);
    await page.click('.picture-toolbar [data-testid="ArrowBackIcon"]');
    await utils.login();
    await page.goto("/");
    await page.locator(".nav-element:has-text('Mehr...')").click();
    await Promise.all([
      page.locator('.MuiButtonBase-root:has-text("Kommentare")').click(),
      page.waitForEvent("framenavigated")
    ]);
    await page.waitForURL("/comment-overview");
    await expect(page.locator('.comment-preview:has-text("Testkommentar1")')).toHaveCount(1);
    await page.locator('.comment-preview:has-text("Testkommentar2")').scrollIntoViewIfNeeded();
    await expect(page.locator('.comment-preview:has-text("Testkommentar2")')).toBeVisible();
    await page.click('.comment-preview:has-text("Testkommentar2")');
    await page.click('#comments');

    await expect(page.locator('.comment-verification-container:has-text("Testkommentar1")')).toBeVisible();
    await page.click('.comment-verification-container:has-text("Testkommentar1") button:has-text("Ablehnen")');
    await page.click('button:has-text("Bestätigen")');

    await expect(page.locator('.comment-verification-container:has-text("Testkommentar2AblehnenAkzeptieren")')).toBeVisible();
    await page.click('.comment-verification-container:has-text("Testkommentar2") button:has-text("Akzeptieren")');

    // navigate again to close the CommentsVerificationView in the background
    await page.goto("/");
    await page.getByText("Logout").click();
    await expect(page.getByText("Erfolgreich ausgeloggt")).toBeVisible();
    // new PlaywrightUtils(page).logout();
    await page.goto('/picture/1');
    await expect(page.getByText('Testkommentar1')).toHaveCount(0);
    await expect(page.getByText('Testkommentar2')).not.toHaveCount(0);
    await expect(page.locator('button:has-text("Akzeptieren")')).not.toBeVisible();
    await expect(page.locator('button:has-text("Bestätigen")')).not.toBeVisible();

  });

  test('is possible to to freely nest comments', async ({ page }) => {
    const utils = new PlaywrightUtils(page);
    await page.click('#comments');
    // await postComment(page, 'Olaf Ober', 'Oberkommentar1');
    await utils.postComment('Olaf Ober', 'Oberkommentar1');
    // await closeModal(page, 'Danke für Ihren Kommentar!', 'Verstanden');
    await utils.closeModal('Danke für Ihren Kommentar!', 'Verstanden');
    await utils.login();
    await page.goto('/picture/1');
    await page.click('#comments');
    await expect(page.locator('.comment-verification-container:has-text("Oberkommentar1")')).not.toHaveCount(0);
    await page.click('.comment-verification-container:has-text("Oberkommentar1") button:has-text("Akzeptieren")');
    await page.click('.comment:has-text("Oberkommentar1") button:has-text("Antworten")');
    await utils.postComment('Hans Unter', 'Unterkommentar1');
    await expect(page.locator('.comment:has-text("Unterkommentar1")')).not.toHaveCount(0);
    await expect(page.locator('.comment-verification-container:has-text("Unterkommentar1")')).not.toHaveCount(0);
    await page.click('.comment-verification-container:has-text("Unterkommentar1") button:has-text("Akzeptieren")');
    await page.click('.comment:has-text("Unterkommentar1") button:has-text("Antworten")');
    await utils.postComment('Hans Unter', 'Unterkommentar2');
    await expect(page.locator('.comment:has-text("Unterkommentar2")')).not.toHaveCount(0);
    await page.click('.comment:has-text("Unterkommentar1") button:has-text("Antworten")');
    await utils.postComment('Hans Unter', 'UnterUnterkommentar1');
    await expect(page.locator('.comment:has-text("UnterUnterkommentar1")')).not.toHaveCount(0);
  });

//   test('deletes all descendants when deleting a comment and shows a warning', async ({ page }) => {
//     await expect(page.locator('.comment')).toContainText('Oberkommentar1');
//     await page.click('.comment:has-text("Oberkommentar1") button:has-text("Löschen")');
//     await closeModal('Warnung', 'Bestätigen');
//     await expect(page).not.toContainText('Oberkommentar1');
//     await expect(page).not.toContainText('Unterkommentar1');
//     await expect(page).not.toContainText('Unterkommentar2');
//     await expect(page).not.toContainText('UnterUnterkommentar1');
//   });

//   test('is possible to edit a comment when logged in', async ({ page }) => {
//     await expect(page.locator('.comment')).toContainText('Testkommentar2');
//     await page.click('.comment:has-text("Testkommentar2") button:has-text("Editieren")');
//     await page.fill('.jodit-react-container', '');
//     await page.click('button:has-text("Editieren")');
//     await expect(page).not.toContainText('Testkommentar2');
//     await expect(page).toContainText('Testkommentar');
//   });

//   test('doesnt show an edit or reply button to unauthorized users', async ({ page }) => {
//     await page.goto('/');
//     await logout();
//     await page.goto('/picture/1');
//     await expect(page).not.toContainText('Testkommentar1');
//     await expect(page).toContainText('Testkommentar');
//     await expect(page.locator('button:has-text("Antworten")')).toBeVisible();
//     await expect(page.locator('button:has-text("Editieren")')).not.toBeVisible();
//     await expect(page.locator('button:has-text("Löschen")')).not.toBeVisible();
//   });
});
