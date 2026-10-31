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
  pictureStepTitle,
  step,
} from '../helper';
import { expect, test } from '../test';

const keyword2 = 'Verifiziertes Testschlagwort 2';
const keyword4 = 'Verifiziertes Testschlagwort 4';

test.describe('bulk edit keyword tags', () => {
  // The remove tests undo what the add tests before them changed
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false });
  test.beforeAll(({ resetData }) => resetData());
  test.use({ curator: true });

  const expectNoTags = async (page: Page) => {
    await expect(infoField(page, 'Schlagworte').locator('input')).toBeVisible();
    await expect(infoField(page, 'Schlagworte').locator('.MuiChip-root')).toHaveCount(0);
  };
  const expectPicture5 = (page: Page, shown: string[], hidden: string[]) =>
    step(pictureStepTitle('5', shown, hidden), async () => {
      await page.goto('/picture/5');
      await expect(infoField(page, 'Schlagworte').locator('input')).toBeVisible();
      for (const value of shown) await expectText(page, value);
      for (const value of hidden) await expectNoText(page, value);
    });

  test('shows the intersection of the given tags', async ({ page }) => {
    await expectPicture(page, '4', [keyword2, keyword4]);
    await expectPicture(page, '3', [keyword2], [keyword4]);
    await visitArchive1Pictures(page);
    await selectPictures(page, '3', '4');
    await bulkEdit(page);
    await expectText(page, keyword2);
    await expectNoText(page, keyword4);
  });

  test("shows no tags when one picture doesn't have any tags", async ({ page }) => {
    await expectPicture(page, '4', [keyword2, keyword4]);
    await page.goto('/picture/5');
    await expectNoTags(page);
    await visitArchive1Pictures(page);
    await selectPictures(page, '4', '5');
    await bulkEdit(page);
    await expectNoTags(page);
  });

  test('adds new tags while keeping old ones', async ({ page }) => {
    await expectPicture(page, '3', [keyword2], [keyword4]);
    await expectPicture5(page, [], [keyword2, keyword4]);
    await visitArchive1Pictures(page);
    await selectPictures(page, '3', '5');
    await bulkEdit(page);
    await addTag(page, 'Schlagworte', keyword4, keyword4);
    await expectText(page, keyword4);
    await expectPicture(page, '3', [keyword2, keyword4]);
    await expectPicture5(page, [keyword4], [keyword2]);
  });

  test('removes tags while keeping untouched ones', async ({ page }) => {
    await visitArchive1Pictures(page);
    await selectPictures(page, '3', '5');
    await bulkEdit(page);
    await removeTag(page, keyword4);
    await expectNoText(page, keyword2);
    await expectNoText(page, keyword4);
    await expectPicture(page, '3', [keyword2], [keyword4]);
    await expectPicture5(page, [], [keyword2, keyword4]);
  });

  test("adds tags to pictures which don't have them yet, even if some already have them", async ({
    page,
  }) => {
    await expectPicture(page, '4', [keyword2, keyword4]);
    await expectPicture(page, '3', [keyword2], [keyword4]);
    await visitArchive1Pictures(page);
    await selectPictures(page, '3', '4');
    await bulkEdit(page);
    await addTag(page, 'Schlagworte', keyword4, keyword4);
    await expectText(page, keyword2);
    await expectText(page, keyword4);
    await expectPicture(page, '4', [keyword2, keyword4]);
    await expectPicture(page, '3', [keyword2, keyword4]);
  });
});
