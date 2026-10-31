import { type Locator, type Page } from '@playwright/test';
import { expect, test } from './test';

const pictureRows = (overview: Locator) =>
  overview.locator('.overview-picture-grid-container div .picture-grid .row:has(.picture-preview)');

const expectRows = async (overview: Locator, max: number) => {
  await expect(pictureRows(overview).first()).toBeVisible();
  expect(await pictureRows(overview).count()).toBeLessThanOrEqual(max);
};

test.describe('Discover View', () => {
  test.beforeEach(({ page }) => page.goto('/discover'));

  const selection = (page: Page, index: number) =>
    page.locator('.overview-selection-container').nth(index);
  const overview = (page: Page, title: string) =>
    page
      .locator('.overview-container')
      .filter({ has: page.getByRole('heading', { name: title, exact: true }) });

  test('shows "Neuzugänge" picture overview', async ({ page }) => {
    await expect(selection(page, 0)).toContainText('Neuzugänge');
    await expect(selection(page, 0)).toContainText('Mehr anzeigen');
    await expectRows(selection(page, 0), 2);
  });

  test('shows "Wissen Sie mehr über diese Bilder?" picture overview', async ({ page }) => {
    await expect(overview(page, 'Wissen Sie mehr über diese Bilder?')).toContainText(
      'Wissen Sie mehr über diese Bilder?'
    );
    await expect(overview(page, 'Wissen Sie mehr über diese Bilder?')).toContainText(
      'Mehr anzeigen'
    );
    await expectRows(overview(page, 'Wissen Sie mehr über diese Bilder?'), 1);
    for (const id of [5, 4, 3]) {
      await expect(
        pictureRows(overview(page, 'Wissen Sie mehr über diese Bilder?')).locator(
          `#picture-preview-for-${id}`
        )
      ).toBeVisible();
    }
  });

  test('shows decades tag overview', async ({ page }) => {
    await selection(page, 1).getByRole('tab', { name: 'Jahrzehnte', exact: true }).click();
    await expect(selection(page, 1)).toContainText('Jahrzehnte');
    await expect(selection(page, 1)).toContainText('Mehr anzeigen');
    const items = selection(page, 1).locator('.overview-collection-grid-container .items .item');
    for (const [index, decade] of ['FRÜHER', '50ER', '60ER', '70ER', '80ER', '90ER'].entries()) {
      await expect(items.nth(index)).toContainText(decade);
    }
  });

  test('shows "Orte" tag overview', async ({ page }) => {
    await selection(page, 2).getByRole('tab', { name: 'Orte', exact: true }).click();
    await expect(selection(page, 2)).toContainText('Orte');
    await expect(selection(page, 2)).toContainText('Mehr anzeigen');
    const items = selection(page, 2).locator('.overview-collection-grid-container .items');
    for (const num of [1, 2, 3, 4, 5, 6]) {
      await expect(items).toContainText(`VERIFIZIERTER TESTORT ${num}`);
    }
  });

  test('shows "Unsere Kategorien" tag overview', async ({ page }) => {
    await expect(overview(page, 'Unsere Kategorien')).toContainText('Unsere Kategorien');
    await expect(overview(page, 'Unsere Kategorien')).toContainText('Mehr anzeigen');
    const items = overview(page, 'Unsere Kategorien').locator(
      '.overview-collection-grid-container .items'
    );
    for (const num of [2, 3, 4, 5, 6, 7]) {
      await expect(items).toContainText(`VERIFIZIERTES TESTSCHLAGWORT ${num}`);
    }
  });
});
