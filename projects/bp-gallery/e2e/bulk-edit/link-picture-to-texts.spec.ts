import { expect, test } from '../test';
import {
  bulkEditOnStart,
  copy,
  expectCannotMarkAsPictures,
  expectLinks,
  linked,
  markAsPictures,
  markAsTexts,
  paste,
  removeLink,
} from './links';

const picture = '40';
const texts = ['30', '31', '32'];

test.describe('bulk edit links from a picture to texts', () => {
  // Each test builds on the links and texts the one before left
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false, curator: true });
  test.beforeAll(({ resetData }) => resetData());

  test('marks multiple pictures as texts', async ({ page }) => {
    await markAsTexts(page, texts);
  });

  test('links a picture to multiple texts', async ({ page }) => {
    await page.goto(`/picture/${picture}`);
    await copy(page, 'Aktuelles Bild kopieren', [picture]);
    await bulkEditOnStart(page, texts);
    await paste(page, 'Ein kopiertes Bild einfügen');
    await expect(linked(page, picture)).toBeVisible();
    await expectLinks(page, texts, [picture]);
    await expectLinks(page, [picture], texts);
  });

  test('prevents marking texts as pictures while pictures are linked', async ({ page }) => {
    await expectCannotMarkAsPictures(page, texts);
  });

  test('removes the links of a picture to multiple texts', async ({ page }) => {
    await removeLink(page, texts, picture);
  });

  test('marks multiple texts as pictures', async ({ page }) => {
    await markAsPictures(page, texts);
  });
});
