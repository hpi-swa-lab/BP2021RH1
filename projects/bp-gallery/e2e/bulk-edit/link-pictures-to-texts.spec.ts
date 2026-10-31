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

const pictures = ['47', '48'];
const texts = ['36', '37', '38'];

test.describe('bulk edit links from pictures to texts', () => {
  // Each test builds on the links and texts the one before left
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false, curator: true });
  test.beforeAll(({ resetData }) => resetData());

  test('marks multiple pictures as texts', async ({ page }) => {
    await markAsTexts(page, texts);
  });

  test('links multiple pictures to multiple texts', async ({ page }) => {
    await bulkEditOnStart(page, pictures);
    await copy(page, 'Aktuelle Bilder kopieren', pictures);
    await bulkEditOnStart(page, texts);
    await paste(page, `${pictures.length} kopierte Bilder einfügen`);
    for (const picture of pictures) await expect(linked(page, picture)).toBeVisible();
    await expectLinks(page, texts, pictures);
    await expectLinks(page, pictures, texts);
  });

  test('removes all links of multiple pictures to multiple texts', async ({ page }) => {
    await removeAllLinks(page, texts, pictures);
  });
});
