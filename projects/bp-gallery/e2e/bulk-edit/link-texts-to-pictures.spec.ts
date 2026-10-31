import { expect, test } from '../test';
import {
  bulkEditOnStart,
  copy,
  expectLinks,
  linked,
  markAsTexts,
  paste,
  removeAllLinks,
} from './links';

const texts = ['34', '35'];
const pictures = ['44', '45', '46'];

test.describe('bulk edit links from texts to pictures', () => {
  // Each test builds on the links and texts the one before left
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false, curator: true });
  test.beforeAll(({ resetData }) => resetData());

  test('marks multiple pictures as texts', async ({ page }) => {
    await markAsTexts(page, texts);
  });

  test('links multiple texts to multiple pictures', async ({ page }) => {
    await bulkEditOnStart(page, texts);
    await copy(page, 'Aktuelle Texte kopieren', texts);
    await bulkEditOnStart(page, pictures);
    await paste(page, `${texts.length} kopierte Texte einfügen`);
    for (const text of texts) await expect(linked(page, text)).toBeVisible();
    await expectLinks(page, pictures, texts);
    await expectLinks(page, texts, pictures);
  });

  test('removes all links of multiple texts to multiple pictures', async ({ page }) => {
    await removeAllLinks(page, pictures, texts);
  });
});
