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
  pictureStepTitle,
  step,
} from '../helper';
import { expect, test } from '../test';

const collection1 = 'Collection 1';
const collection2 = 'Collection 2';
const topLevel = 'Top-Level collection';

test.describe('bulk edit collections', () => {
  test.use({ curator: true });

  const expectNoCollections = async (page: Page) => {
    await expect(infoField(page, 'Collections').locator('input')).toBeVisible();
    await expect(infoField(page, 'Collections').locator('.MuiChip-root')).toHaveCount(0);
  };
  // Picture 1 has only the top-level collection, so this checks it before the texts
  const expectPicture1 = (page: Page, shown: string[], hidden: string[]) =>
    step(pictureStepTitle('1', shown, hidden), async () => {
      await page.goto('/picture/1');
      await expect(infoField(page, 'Collections').locator('input')).toBeVisible();
      await expect(chip(page, topLevel)).toBeVisible();
      for (const value of shown) await expectText(page, value);
      for (const value of hidden) await expectNoText(page, value);
    });

  test('shows the intersection of the given collections', async ({ page }) => {
    await expectPicture(page, '3', [collection1, collection2]);
    await expectPicture(page, '2', [collection1], [collection2]);
    await visitArchive1Pictures(page);
    await selectPictures(page, '3', '2');
    await bulkEdit(page);
    await expectText(page, collection1);
    await expectNoText(page, collection2);
  });

  test("shows no collections when one picture doesn't have any collections", async ({ page }) => {
    // create a picture without collections
    await page.goto('/picture/1');
    await removeTag(page, topLevel);

    await expectPicture(page, '3', [collection1, collection2]);
    await page.goto('/picture/1');
    await expectNoCollections(page);
    await visitArchive1Pictures(page);
    await selectPictures(page, '3', '1');
    await bulkEdit(page);
    await expectNoCollections(page);
  });

  test.describe('adding and removing', () => {
    // The remove tests undo what the add tests before them changed
    test.describe.configure({ mode: 'serial' });
    test.use({ freshData: false });
    test.beforeAll(({ resetData }) => resetData());

    test('adds new collections while keeping old ones', async ({ page }) => {
      await expectPicture(page, '2', [collection1], [collection2]);
      await expectPicture1(page, [], [collection1, collection2]);
      await visitArchive1Pictures(page);
      await selectPictures(page, '2', '1');
      await bulkEdit(page);
      await addTag(page, 'Collections', collection2, collection2);
      await expectText(page, collection2);
      await expectPicture(page, '2', [collection1, collection2]);
      await expectPicture1(page, [collection2], [collection1]);
    });

    test('removes collections while keeping untouched ones', async ({ page }) => {
      await visitArchive1Pictures(page);
      await selectPictures(page, '2', '1');
      await bulkEdit(page);
      await removeTag(page, collection2);
      await expectNoText(page, collection1);
      await expectNoText(page, collection2);
      await expectPicture(page, '2', [collection1], [collection2]);
      await expectPicture1(page, [], [collection1, collection2]);
    });

    test("adds collections to pictures which don't have them yet, even if some already have them", async ({
      page,
    }) => {
      await expectPicture(page, '3', [collection1, collection2]);
      await expectPicture(page, '2', [collection1], [collection2]);
      await visitArchive1Pictures(page);
      await selectPictures(page, '3', '2');
      await bulkEdit(page);
      await addTag(page, 'Collections', collection2, collection2);
      await expectText(page, collection1);
      await expectText(page, collection2);
      await expectPicture(page, '3', [collection1, collection2]);
      await expectPicture(page, '2', [collection1, collection2]);
    });
  });
});
