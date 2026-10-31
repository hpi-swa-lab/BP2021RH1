import { type Page } from '@playwright/test';
import { expectText, scrollToBottom } from './helper';
import { expect, test } from './test';

test.describe('link pictures with texts', () => {
  // Picture 1 stays marked as text and the links stay for the tests after the one that adds them
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false });
  test.beforeAll(({ resetData }) => resetData());
  test.use({ curator: true });

  const preview = (page: Page, id: string, scope = '') =>
    page.locator(`${scope} #picture-preview-for-${id}`);
  const links = (page: Page) => page.locator('.picture-info-field[data-type="links"]');
  const clipboard = (page: Page) => page.locator('.clipboard-editor');

  const selectTextFilter = async (page: Page, from: string, to: string) => {
    await page.getByRole('button', { name: from, exact: true }).click();
    await page.getByRole('option', { name: to, exact: true }).click();
  };

  // Shows picture 2 without text 1 first, then both, then only the text; loadAll scrolls down after
  // each change, for views whose first page may not reach them
  const expectTextFilter = async (
    page: Page,
    { scope = '', pictureId = '2', textId = '1', loadAll = false } = {}
  ) => {
    const shown = async (id: string) => {
      if (loadAll) await scrollToBottom(page);
      await expect(preview(page, id, scope).first()).toBeVisible();
    };
    const hidden = (id: string) => expect(preview(page, id, scope)).toHaveCount(0);
    await test.step('only pictures', async () => {
      await shown(pictureId);
      await hidden(textId);
    });
    await test.step('pictures and texts', async () => {
      await selectTextFilter(page, 'Nur Bilder anzeigen', 'Bilder und Texte anzeigen');
      await shown(pictureId);
      await shown(textId);
    });
    await test.step('only texts', async () => {
      await selectTextFilter(page, 'Bilder und Texte anzeigen', 'Nur Texte anzeigen');
      await shown(textId);
      await hidden(pictureId);
    });
  };

  const copyToClipboard = async (page: Page, button: string, id: string) => {
    await page.locator('.clipboard-editor-open').click();
    await expectText(clipboard(page), 'Keine Bilder');
    await clipboard(page).getByRole('button', { name: button, exact: true }).click();
    await expect(preview(page, id, '.clipboard-editor')).toBeVisible();
  };

  const paste = async (page: Page, button: string) => {
    await links(page).getByRole('button', { name: button, exact: true }).click();
  };

  test('marks a picture as text', async ({ page }) => {
    await page.goto('/picture/1');
    await expectText(page, 'Verlinkte Texte');
    const mark = page.getByRole('button', { name: 'Als Text markieren', exact: true });
    await expect(mark.getByTestId('CheckBoxOutlineBlankIcon')).toBeVisible();
    await mark.click();
    await expect(mark.getByTestId('CheckBoxIcon')).toBeVisible();
    await expectText(page, 'Verlinkte Bilder');
  });

  test('shows texts in the search only when asked for', async ({ page }) => {
    await page.goto('/search');
    const input = page.getByRole('textbox', {
      name: 'In allen Bildinformationen suchen',
      exact: true,
    });
    await input.fill('Yet another description');
    await input.press('Enter');
    await expectTextFilter(page);
  });

  test('shows no texts in the picture overview of an archive', async ({ page }) => {
    await page.goto('/archives/1');
    await expect(preview(page, '2').first()).toBeVisible();
    await expect(preview(page, '1')).toHaveCount(0);
  });

  // Curators see pictures and texts by default, visitors only pictures
  for (const [view, path] of [
    ['the pictures of an archive', '/archives/1/show-more/pictures'],
    ['the keywords of an archive', '/archives/1/show-more/keyword'],
    ['a keyword of an archive', '/archives/1/show-more/keyword/9'],
  ]) {
    test(`shows texts in ${view} to visitors only when asked for`, async ({ browser }) => {
      const page = await browser.newPage();
      await page.goto(path);
      await expectTextFilter(page);
      await page.close();
    });
  }

  test('shows texts on the start page to visitors only when asked for', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/start');
    // The newest pictures come first, so text 1 is on the second page
    await expectTextFilter(page, {
      scope: '.collection-picture-display',
      pictureId: '130',
      loadAll: true,
    });
    await page.close();
  });

  test('texts do not reduce the number of fetched pictures', async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/start');
    await expect(page.locator('.picture-count')).toHaveText('Mehr als 100 Bilder');
    await page.close();
  });

  test('links a picture to a text', async ({ page }) => {
    await page.goto('/picture/2');
    await expect(page.locator('.clipboard-editor-open')).toHaveAttribute('title', 'Kopierte Links');
    await copyToClipboard(page, 'Aktuelles Bild kopieren', '2');
    await page.goto('/picture/1');
    await paste(page, 'Ein kopiertes Bild einfügen');
    await expect(preview(page, '2', '.picture-info-field[data-type="links"]')).toBeVisible();
    await page.goto('/picture/2');
    await expect(preview(page, '1', '.picture-info-field[data-type="links"]')).toBeVisible();
  });

  test('links a text to a picture', async ({ page }) => {
    await page.goto('/picture/1');
    await copyToClipboard(page, 'Aktuellen Text kopieren', '1');
    await page.goto('/picture/3');
    await paste(page, 'Einen kopierten Text einfügen');
    await expect(preview(page, '1', '.picture-info-field[data-type="links"]')).toBeVisible();
    await page.goto('/picture/1');
    await expect(preview(page, '3', '.picture-info-field[data-type="links"]')).toBeVisible();
  });

  test('shows linked pictures and texts to visitors', async ({ browser }) => {
    const page = await browser.newPage();
    const linked = (id: string) => preview(page, id, '.picture-info-field[data-type="links"]');
    await page.goto('/picture/1');
    await expectText(page, 'Verlinkte Bilder');
    await expect(linked('2')).toBeVisible();
    await expect(linked('3')).toBeVisible();
    for (const id of ['2', '3']) {
      await page.goto(`/picture/${id}`);
      await expectText(page, 'Verlinkte Texte');
      await expect(linked('1')).toBeVisible();
    }
    await page.close();
  });
});
