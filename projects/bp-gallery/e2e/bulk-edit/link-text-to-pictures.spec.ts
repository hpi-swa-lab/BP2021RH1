import { expect, test } from '../test';
import {
  bulkEditOnStart,
  copy,
  expectLinks,
  linked,
  markAsTexts,
  paste,
  removeLink,
} from './links';

const text = '33';
const pictures = ['41', '42', '43'];

test.describe('bulk edit links from a text to pictures', () => {
  // Each test builds on the links and texts the one before left
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false, curator: true });
  test.beforeAll(({ resetData }) => resetData());

  test('marks a picture as text', async ({ page }) => {
    await markAsTexts(page, [text]);
  });

  test('links a text to multiple pictures', async ({ page }) => {
    await page.goto(`/picture/${text}`);
    await copy(page, 'Aktuellen Text kopieren', [text]);
    await bulkEditOnStart(page, pictures);
    await paste(page, 'Einen kopierten Text einfügen');
    await expect(linked(page, text)).toBeVisible();
    await expectLinks(page, pictures, [text]);
    await expectLinks(page, [text], pictures);
  });

  test('removes the links of a text to multiple pictures', async ({ page }) => {
    await removeLink(page, pictures, text);
  });
});
