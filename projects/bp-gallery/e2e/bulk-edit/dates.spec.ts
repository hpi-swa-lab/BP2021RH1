import { type Page } from '@playwright/test';
import {
  bulkEdit,
  expectPicture,
  expectSaved,
  expectText,
  selectPictures,
  text,
  visitArchive1Pictures,
  waitForCuratorPictureInfo,
  step,
} from '../helper';
import { test } from '../test';

test.describe('bulk edit dates', () => {
  test.use({ curator: true });

  const setDate = (page: Page, date: string) =>
    step(`set the date to ${date}`, async () => {
      const input = page.locator('input.rdrDateInput, .rdrDateInput input').first();
      await expectSaved(page, async () => {
        await input.fill(date);
        await input.press('Enter');
        await page.keyboard.press('Escape');
      });
    });

  test('shows the same date as the date', async ({ page }) => {
    await visitArchive1Pictures(page);
    await selectPictures(page, '2', '3');
    await bulkEdit(page);
    await expectText(page, '01.01.1961 - 31.01.2022');
  });

  test('shows different dates as no date', async ({ page }) => {
    await visitArchive1Pictures(page);
    await selectPictures(page, '2', '5');
    await bulkEdit(page);
    await expectText(page, 'Keine Zeit bekannt');
  });

  test('sets the date of different dates to the same, set date', async ({ page }) => {
    await visitArchive1Pictures(page);
    await selectPictures(page, '1', '5');
    await bulkEdit(page);
    await waitForCuratorPictureInfo(page);
    await text(page, 'Keine Zeit bekannt').click();
    await setDate(page, '20.04.1969');

    for (const id of ['5', '1']) {
      await expectPicture(page, id, ['20.04.1969']);
    }
  });
});
