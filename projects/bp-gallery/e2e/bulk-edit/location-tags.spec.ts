import { type Page } from '@playwright/test';
import {
  addTag,
  bulkEdit,
  chip,
  expectNoText,
  expectPicture,
  expectText,
  infoField,
  removeTag,
  selectPictures,
  visitArchive1Pictures,
  visitStartAndLoadNextPage,
  pictureStepTitle,
  step,
} from '../helper';
import { expect, test } from '../test';

const testort1 = 'Testort 1';
const marketPlace = 'Market place';
const testort3 = 'Verifizierter Testort 3';
const harzburg = 'Bad Harzburg';

test.describe('bulk edit location tags', () => {
  // The remove tests undo what the add tests before them changed
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false });
  test.beforeAll(({ resetData }) => resetData());
  test.use({ curator: true });

  const places = (page: Page) => infoField(page, 'Orte');
  const expectNoTags = async (page: Page) => {
    await expect(places(page).locator('input')).toBeVisible();
    await expect(places(page).locator('.MuiChip-root')).toHaveCount(0);
  };
  // Picture 25 has no locations, so this checks the empty field before the texts
  const expectPicture25 = (page: Page, shown: string[], hidden: string[]) =>
    step(pictureStepTitle('25', shown, hidden), async () => {
      await page.goto('/picture/25');
      await expect(places(page).locator('input')).toBeVisible();
      for (const value of shown) await expectText(page, value);
      await expect(chip(page, harzburg)).toHaveCount(0);
      for (const value of hidden) await expectNoText(page, value);
    });

  test('shows the intersection of the given tags', async ({ page }) => {
    await expectPicture(page, '1', [testort1, marketPlace]);
    await expectPicture(page, '4', [testort1], [marketPlace]);
    await visitArchive1Pictures(page);
    await selectPictures(page, '1', '4');
    await bulkEdit(page);
    await expectText(page, testort1);
    await expectNoText(page, marketPlace);
  });

  test("shows no tags when one picture doesn't have any tags", async ({ page }) => {
    await expectPicture(page, '1', [harzburg, marketPlace]);
    await page.goto('/picture/25');
    await expectNoTags(page);
    await visitStartAndLoadNextPage(page);
    await selectPictures(page, '1', '25');
    await bulkEdit(page);
    await expectNoTags(page);
  });

  test('adds new tags while keeping old ones', async ({ page }) => {
    await page.goto('/picture/1');
    await expect(chip(page, harzburg)).toBeVisible();
    await expectNoText(page, testort3);
    await expectPicture25(page, [], [testort3]);
    await visitStartAndLoadNextPage(page);
    await selectPictures(page, '1', '25');
    await bulkEdit(page);
    await addTag(page, 'Orte', testort3, testort3);
    await expectText(page, testort3);
    await page.goto('/picture/1');
    await expect(chip(page, harzburg)).toBeVisible();
    await expectText(page, testort3);
    await expectPicture25(page, [testort3], []);
  });

  test('removes tags while keeping untouched ones', async ({ page }) => {
    await visitStartAndLoadNextPage(page);
    await selectPictures(page, '1', '25');
    await bulkEdit(page);
    await removeTag(page, testort3);
    await expect(chip(page, harzburg)).toHaveCount(0);
    await expectNoText(page, testort3);
    await page.goto('/picture/1');
    await expect(chip(page, harzburg)).toBeVisible();
    await expectNoText(page, testort3);
    await expectPicture25(page, [], [testort3]);
  });

  test("adds tags to pictures which don't have them yet, even if some already have them", async ({
    page,
  }) => {
    await page.goto('/picture/1');
    await expect(chip(page, harzburg)).toBeVisible();
    await expectText(page, marketPlace);
    await page.goto('/picture/4');
    await expect(chip(page, harzburg)).toBeVisible();
    await expectNoText(page, marketPlace);
    await visitArchive1Pictures(page);
    await selectPictures(page, '1', '4');
    await bulkEdit(page);
    await addTag(page, 'Orte', 'Market', marketPlace);
    await expect(chip(page, harzburg)).toBeVisible();
    await expectText(page, marketPlace);
    for (const id of ['1', '4']) {
      await page.goto(`/picture/${id}`);
      await expect(chip(page, harzburg)).toBeVisible();
      await expectText(page, marketPlace);
    }
  });
});
