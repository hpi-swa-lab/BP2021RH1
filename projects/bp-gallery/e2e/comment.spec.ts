import { type Locator, type Page } from '@playwright/test';
import { expectNoText, expectText, login, logout, caseSensitive } from './helper';
import { expect, test } from './test';

test.describe('Comment', () => {
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false });
  let page: Page;
  test.beforeAll(async ({ browser, resetData }) => {
    await resetData();
    page = await browser.newPage();
    await page.goto('/picture/1');
  });
  test.afterAll(() => page.close());

  // The innermost element with the comment text; replies are nested inside the comment they
  // answer, and the names of other comments contain this one ("UnterUnterkommentar1",
  // "Testkommentar1")
  const own = (selector: string, value: string, scope: Page | Locator = page) => {
    const word = new RegExp(`(?<!Unter)${value}(?!\\d)`);
    return scope
      .locator(selector, { hasText: word })
      .filter({ hasNot: page.locator(selector, { hasText: word }) });
  };
  const button = (scope: Page | Locator, label: string) =>
    scope.locator('button', { hasText: caseSensitive(label) }).first();

  const postComment = async (scope: Page | Locator, name: string, comment: string) => {
    await scope.locator('input#name').first().fill(name);
    await scope.locator('textarea#text').first().fill(comment);
    await scope
      .locator('.MuiButton-root', { hasText: caseSensitive('Absenden') })
      .first()
      .click();
  };
  const closeModal = async (text: string, buttonText: string) => {
    await expect(page.getByRole('dialog')).toContainText(text);
    await page.locator('.MuiButton-root', { hasText: caseSensitive(buttonText) }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  };

  test('adds a comment to picture 1', async () => {
    for (const comment of ['Testkommentar1', 'Testkommentar2']) {
      await postComment(page, 'Hans Hansen', comment);
      await closeModal('Danke für Ihren Kommentar!', 'O.K.');
    }
  });

  test('log in as curator and curate the new comments', async () => {
    await page.locator('.picture-toolbar [data-testid="ArrowBackIcon"]').click();
    await login(page);
    await page.locator('.nav-bar').getByText('Mehr...', { exact: true }).click();
    await page.locator('.MuiPaper-root').getByText('Kommentare', { exact: true }).click();

    await expect(
      page.locator('.comment-preview', { hasText: caseSensitive('Testkommentar1') })
    ).toBeVisible();
    await page.locator('.comment-preview', { hasText: caseSensitive('Testkommentar2') }).click();

    await button(own('.comment-verification-container', 'Testkommentar1'), 'Ablehnen').click();
    await button(page, 'Bestätigen').click();
    await button(own('.comment-verification-container', 'Testkommentar2'), 'Akzeptieren').click();
    await expect(own('.comment-verification-container', 'Testkommentar2')).not.toHaveClass(
      /unverified/
    );

    // navigate again to close the CommentsVerificationView in the background
    await page.goto('/picture/1');

    await expectText(page, 'Testkommentar2');
    await expectNoText(page, 'Testkommentar1');
    await expect(page.locator('button', { hasText: caseSensitive('Akzeptieren') })).toHaveCount(0);
    await expect(page.locator('button', { hasText: caseSensitive('Bestätigen') })).toHaveCount(0);
  });

  test('is possible to freely nest comments', async () => {
    const accept = async (comment: string) => {
      await button(own('.comment-verification-container', comment), 'Akzeptieren').click();
      await expect(own('.comment-verification-container', comment)).not.toHaveClass(/unverified/);
    };
    const reply = async (to: string, name: string, comment: string) => {
      const parent = own('.comment', to);
      await button(parent, 'Antworten').click();
      await postComment(parent, name, comment);
      await expect(own('.comment', comment, parent)).toBeVisible();
    };

    await postComment(page, 'Olaf Ober', 'Oberkommentar1');
    await closeModal('Danke für Ihren Kommentar!', 'Verstanden');
    await accept('Oberkommentar1');
    await reply('Oberkommentar1', 'Hans Unter', 'Unterkommentar1');
    await accept('Unterkommentar1');
    await reply('Oberkommentar1', 'Hans Unter', 'Unterkommentar2');
    await reply('Unterkommentar1', 'Hans Unter', 'UnterUnterkommentar1');
  });

  test('deletes all descendants when deleting a comment and shows a warning', async () => {
    await button(own('.comment', 'Oberkommentar1'), 'Löschen').click();
    await closeModal('Warnung', 'Bestätigen');
    for (const comment of [
      'Oberkommentar1',
      'Unterkommentar1',
      'Unterkommentar2',
      'UnterUnterkommentar1',
    ]) {
      await expect(own('.comment', comment)).toHaveCount(0);
    }
  });

  test('is possible to edit a comment when logged in', async () => {
    const comment = own('.comment', 'Testkommentar2');
    await button(comment, 'Editieren').click();
    await comment.locator('.jodit-wysiwyg').click();
    await page.keyboard.press('End');
    await page.keyboard.press('Backspace');
    // the comment now reads Testkommentar
    await button(own('.comment', 'Testkommentar'), 'Editieren').click();
    await expectNoText(page, 'Testkommentar2');
    await expectText(page, 'Testkommentar');
  });

  test("doesn't show an edit or reply button to unauthorized users", async () => {
    await page.goto('/');
    await logout(page);
    await page.goto('/picture/1');
    await expectText(page, 'Testkommentar');
    await expectNoText(page, 'Testkommentar1');
    await expect(
      page.locator('button', { hasText: caseSensitive('Antworten') }).first()
    ).toBeVisible();
    await expect(page.locator('button', { hasText: caseSensitive('Editieren') })).toHaveCount(0);
    await expect(page.locator('button', { hasText: caseSensitive('Löschen') })).toHaveCount(0);
  });
});
