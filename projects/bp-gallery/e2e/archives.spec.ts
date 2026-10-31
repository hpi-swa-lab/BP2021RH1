import { type Page } from '@playwright/test';
import { expectNoText, expectText, login, caseSensitive } from './helper';
import { expect, test } from './test';

test.describe('Archives View', () => {
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false });
  let page: Page;
  test.beforeAll(async ({ browser, resetData }) => {
    await resetData();
    page = await browser.newPage();
    await page.goto('/archives/1');
  });
  test.afterAll(() => page.close());

  const editor = () => page.locator('.jodit-react-container .jodit-wysiwyg');
  const overview = (title: string) =>
    page.locator('.overview-container', { hasText: caseSensitive(title) });
  const selection = (title: string) =>
    page.locator('.overview-selection-container', { hasText: caseSensitive(title) });
  const linkTitle = () => page.locator('#archive-form-title');
  const linkUrl = () => page.locator('#archive-form-url');

  test('shows the first archive name and no edit button', async () => {
    await expectText(page, 'Herbert-Ahrens-Bilderarchiv');
    await expect(page.locator('[data-cy="archive-edit"]')).toHaveCount(0);
  });

  test('shows an edit button upon login', async () => {
    await login(page);
    await expect(page.locator('[data-cy="archive-edit"]')).toBeVisible();
  });

  test('redirects to the archive edit page after pressing on the edit button', async () => {
    await page.locator('[data-cy="archive-edit"]').click();
    await expect(page).toHaveURL('/archives/1/edit');
  });

  test('successfully edits the archive name and long description', async () => {
    await page.locator('#archive-form-name').fill('Herbert-Ahrens-Testarchiv');
    await expect(page.locator('#archive-form-name')).toHaveValue('Herbert-Ahrens-Testarchiv');
    await expect(editor()).toHaveText('');
    await editor().click();
    await page.keyboard.type('Testbeschreibung');
    await expect(editor()).toContainText('Testbeschreibung');
    await page.locator('#archive-form-logo').setInputFiles('public/logo512.png');
    await expect(page.locator('img').first()).toBeVisible();
  });

  test('successfully adds, removes and edits a link', async () => {
    const addLink = async (title: string, url: string) => {
      await page.getByText('Link hinzufügen', { exact: true }).click();
      await linkTitle().fill(title);
      await linkUrl().fill(url);
    };
    await test.step('add and save Test-Link 1', async () => {
      await addLink('Test-Link 1', 'test1.de');
      await page.locator('.archive-link-entry [data-testid="SaveIcon"]').click();
    });
    await test.step('add Test-Link 2 and edit Test-Link 1', async () => {
      await addLink('Test-Link 2', 'test2.de');
      await linkUrl().blur();
      await page.locator('.archive-link-entry').first().getByTestId('EditIcon').click();
      await expect(linkTitle()).toHaveValue('Test-Link 1');
      await linkTitle().fill('Test-Link 1 Edit');
      await linkTitle().blur();
    });
    await test.step('add Test-Link 3 and delete Test-Link 2', async () => {
      await addLink('Test-Link 3', 'test3.de');
      await linkUrl().blur();
      await page.locator('.archive-link-entry').nth(1).getByTestId('DeleteIcon').click();
      await expectText(page, 'Test-Link 1 Edit');
      await expectNoText(page, 'Test-Link 2');
    });
    await test.step('save Test-Link 3', async () => {
      await page.getByTestId('SaveIcon').nth(1).click();
      await expectText(page, 'Test-Link 3');
    });
  });

  test('successfully posts the form data', async () => {
    await page.getByText('Änderungen speichern', { exact: true }).click();
    await expectText(page, 'Änderungen gespeichert');
    await page.getByText('Zum Archiv', { exact: true }).click();
    await expectText(page, 'Herbert-Ahrens-Testarchiv');
    await expectNoText(page, 'Herbert-Ahrens-Bilderarchiv');
    await expectText(page, 'Testbeschreibung');
    await expect(page.locator('.archive-logo')).toBeVisible();
    await expectText(page, 'Test-Link 1 Edit');
    await expectText(page, 'Test-Link 3');
  });

  test('successfully sets an image as showcase picture when pressing on the star button via show more for keywords', async () => {
    await overview('Unsere Kategorien').getByText('Mehr anzeigen', { exact: true }).click();
    await page.getByTestId('StarIcon').nth(1).click();
    await page.getByText('Zurück', { exact: true }).click();
    await expect(page.locator('.archive-showcase #picture-preview-for-4')).toBeVisible();
  });

  test('successfully sets an image as showcase picture when pressing on the star button via "Unsere Bilder"', async () => {
    await selection('Unsere Bilder').getByText('Mehr anzeigen', { exact: true }).click();
    await page.getByTestId('StarIcon').first().click();
    await page.getByText('Zurück', { exact: true }).click();
    await expect(page.locator('.archive-showcase #picture-preview-for-5')).toBeVisible();
  });

  test('successfully sets an image as showcase picture when pressing on the star button via show more for "Verifiziertes Testschlagwort 2', async () => {
    await overview('Unsere Kategorien')
      .getByText('VERIFIZIERTES TESTSCHLAGWORT 2', { exact: true })
      .click();
    await expect(page.locator('.show-more-container')).toContainText(
      'Verifiziertes Testschlagwort 2'
    );
    await page.getByTestId('StarIcon').nth(1).click();
    await page.getByText('Zurück', { exact: true }).click();
    await expect(page.locator('.archive-showcase #picture-preview-for-2')).toBeVisible();
  });

  test('shows "Unsere Bilder" picture overview', async () => {
    await expect(
      selection('Unsere Bilder').getByText('Mehr anzeigen', { exact: true })
    ).toBeVisible();
    const rows = page
      .locator('.overview-container')
      .first()
      .locator('.overview-picture-grid-container div .picture-grid .row:has(.picture-preview)');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeLessThanOrEqual(2);
  });

  test('shows "Unsere Kategorien" picture overview', async () => {
    await expect(
      overview('Unsere Kategorien').getByText('Mehr anzeigen', { exact: true })
    ).toBeVisible();
    const items = overview('Unsere Kategorien').locator(
      '.overview-collection-grid-container .items'
    );
    for (const num of [2, 3, 4, 5, 6, 7]) {
      await expect(items).toContainText(`VERIFIZIERTES TESTSCHLAGWORT ${num}`);
    }
  });
});
