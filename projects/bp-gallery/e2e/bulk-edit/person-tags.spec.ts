import { type Page } from '@playwright/test';
import {
  addTag,
  bulkEdit,
  expectNoText,
  expectPicture,
  expectText,
  infoField,
  removeTag,
  selectPictures,
  visitArchive1Pictures,
} from '../helper';
import { expect, test } from '../test';

const simon = 'Simon Heraldson';
const katharina = 'Katharina Schmunk';

test.describe('bulk edit person tags', () => {
  // The remove tests undo what the add tests before them changed
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false });
  test.beforeAll(({ resetData }) => resetData());
  test.use({ curator: true });

  const expectNoTags = async (page: Page) => {
    await expect(infoField(page, 'Personen').locator('input')).toBeVisible();
    await expect(infoField(page, 'Personen').locator('.MuiChip-root')).toHaveCount(0);
  };

  test('shows the intersection of the given tags', async ({ page }) => {
    await expectPicture(page, '2', [simon, katharina]);
    await expectPicture(page, '3', [simon], [katharina]);
    await visitArchive1Pictures(page);
    await selectPictures(page, '2', '3');
    await bulkEdit(page);
    await expectText(page, simon);
    await expectNoText(page, katharina);
  });

  test("shows no tags when one picture doesn't have any tags", async ({ page }) => {
    await page.goto('/picture/1');
    await expectNoTags(page);
    await expectPicture(page, '2', [simon, katharina]);
    await visitArchive1Pictures(page);
    await selectPictures(page, '1', '2');
    await bulkEdit(page);
    await expectNoTags(page);
  });

  test('adds new tags while keeping old ones', async ({ page }) => {
    await page.goto('/picture/1');
    await expect(infoField(page, 'Personen').locator('input')).toBeVisible();
    await expectNoText(page, simon);
    await expectNoText(page, katharina);
    await expectPicture(page, '3', [simon], [katharina]);
    await visitArchive1Pictures(page);
    await selectPictures(page, '1', '3');
    await bulkEdit(page);
    await addTag(page, 'Personen', 'Katharina', katharina);
    await expectText(page, katharina);
    await expectPicture(page, '1', [katharina], [simon]);
    await expectPicture(page, '3', [simon, katharina]);
  });

  test('removes tags while keeping untouched ones', async ({ page }) => {
    await visitArchive1Pictures(page);
    await selectPictures(page, '1', '3');
    await bulkEdit(page);
    await removeTag(page, katharina);
    await expectNoText(page, simon);
    await expectNoText(page, katharina);
    await page.goto('/picture/1');
    await expect(infoField(page, 'Personen').locator('input')).toBeVisible();
    await expectNoText(page, simon);
    await expectNoText(page, katharina);
    await expectPicture(page, '3', [simon], [katharina]);
  });

  test("adds tags to pictures which don't have them yet, even if some already have them", async ({
    page,
  }) => {
    await expectPicture(page, '2', [simon, katharina]);
    await expectPicture(page, '3', [simon], [katharina]);
    await visitArchive1Pictures(page);
    await selectPictures(page, '2', '3');
    await bulkEdit(page);
    await addTag(page, 'Personen', 'Katharina', katharina);
    await expectText(page, simon);
    await expectText(page, katharina);
    await expectPicture(page, '2', [simon, katharina]);
    await expectPicture(page, '3', [simon, katharina]);
  });
});
