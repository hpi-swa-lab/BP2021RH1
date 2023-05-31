import { Page, expect, test } from '@playwright/test';
import { PlaywrightUtils } from './utils/playwright-utils';



test.describe('Comment', () => {
  let page: Page;
  let utils: PlaywrightUtils;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new PlaywrightUtils(page);
  });

  test.beforeEach(async () => {
    await page.goto('/picture/1');
  });

  test.afterAll(async () => {
    await utils.login();
    await page.goto('/picture/1');
    await page.click("#comments");
    await page.click('.comment:has-text("Testkommentar") button:has-text("Löschen")');
    await utils.closeModal('Soll', 'Bestätigen');
    await expect(page.getByText("Testkommentar")).toHaveCount(0);
  });

  test('adds a comment to picture 1', async () => {
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

  test('log in as curator and curate the new comments', async () => {
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
    await utils.logout();
    // new PlaywrightUtils(page).logout();
    await page.goto('/picture/1');
    await expect(page.getByText('Testkommentar1')).toHaveCount(0);
    await expect(page.getByText('Testkommentar2')).not.toHaveCount(0);
    await expect(page.locator('button:has-text("Akzeptieren")')).not.toBeVisible();
    await expect(page.locator('button:has-text("Bestätigen")')).not.toBeVisible();

  });

  test('is possible to to freely nest comments', async () => {
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

  test('deletes all descendants when deleting a comment and shows a warning', async () => {
    await page.goto('/picture/1');
    await page.click('#comments');
    await expect(page.locator('.comment:has-text("Oberkommentar1")')).not.toHaveCount(0);
    await page.click('.comment:has-text("Oberkommentar1") button:has-text("Löschen")');
    await utils.closeModal('Warnung', 'Bestätigen');
    await expect(page.locator('Oberkommentar1')).toHaveCount(0);
    await expect(page.locator('Unterkommentar1')).toHaveCount(0);
    await expect(page.locator('Unterkommentar2')).toHaveCount(0);
    await expect(page.locator('UnterUnterkommentar1')).toHaveCount(0);
  });

  test('is possible to edit a comment when logged in', async () => {
    await page.goto('/picture/1');
    await page.click('#comments');
    await expect(page.locator('.comment:has-text("Testkommentar2")')).not.toHaveCount(0);
    await page.locator('.comment:has-text("Testkommentar2") button:has-text("Editieren")').click();
    await page.locator('.jodit-wysiwyg:has-text("Testkommentar2")').click();
    await page.keyboard.press('Backspace');
    await page.locator('.comment:has(.jodit-wysiwyg) button:has-text("Editieren")').click();
    await expect(page.locator("Testkommentar2")).toHaveCount(0);
    await expect(page.getByText('Testkommentar')).not.toHaveCount(0);
  });

  test('doesnt show an edit or reply button to unauthorized users', async () => {
    await utils.logout();
    await page.goto('/picture/1');
    await page.click('#comments');
    await expect(page.getByText("Testkommentar1")).toHaveCount(0);
    await expect(page.getByText("Testkommentar")).not.toHaveCount(0);
    await expect(page.locator('button:has-text("Antworten")')).toBeVisible();
    await expect(page.locator('button:has-text("Editieren")')).not.toBeVisible();
    await expect(page.locator('button:has-text("Löschen")')).not.toBeVisible();
  });
});
