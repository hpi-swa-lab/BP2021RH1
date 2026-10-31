import { type Page } from '@playwright/test';
import { expectText, caseSensitive } from './helper';
import { expect, test } from './test';

const overview = (page: Page, title: string) =>
  page.locator('.overview-container', { hasText: caseSensitive(title) });
const selection = (page: Page, title: string) =>
  page.locator('.overview-selection-container', { hasText: caseSensitive(title) });
const items = (page: Page) => page.locator('.overview-collection-grid-container .items');

const expectPictures = async (page: Page, ids: number[]) => {
  for (const id of ids) {
    await expect(page.locator(`.picture-grid .row #picture-preview-for-${id}`)).toBeVisible();
  }
};

test.describe('Navigation to Show More View from Discover View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/discover');
  });

  test('works for "Neuzugänge"', async ({ page }) => {
    await selection(page, 'Neuzugänge').getByText('Mehr anzeigen', { exact: true }).click();
    await expect(page).toHaveURL('/show-more/latest');
  });

  test('works for "Wissen Sie mehr über diese Bilder?"', async ({ page }) => {
    await overview(page, 'Wissen Sie mehr über diese Bilder?')
      .getByText('Mehr anzeigen', { exact: true })
      .click();
    await expect(page).toHaveURL('/show-more/pictures/Fragezeichen');
  });

  test('works for "Jahrzehnte"', async ({ page }) => {
    await page
      .locator('.overview-selection-container')
      .nth(1)
      .getByRole('tab', { name: 'Jahrzehnte', exact: true })
      .click();
    await selection(page, 'Jahrzehnte').getByText('Mehr anzeigen', { exact: true }).click();
    await expect(page).toHaveURL('/show-more/date');
  });

  test('works for single decades', async ({ page }) => {
    await page
      .locator('.overview-selection-container')
      .nth(1)
      .getByRole('tab', { name: 'Jahrzehnte', exact: true })
      .click();
    for (let i = 0; i < 6; i++) {
      await selection(page, 'Jahrzehnte')
        .locator('.overview-collection-grid-container .items .item')
        .nth(i)
        .click();
      await expect(page).toHaveURL(`/show-more/date/${i + 4}`);
      await page.goBack();
    }
  });

  test('works for "Orte"', async ({ page }) => {
    await page
      .locator('.overview-selection-container')
      .nth(2)
      .getByRole('tab', { name: 'Orte', exact: true })
      .click();
    await selection(page, 'Orte').getByText('Mehr anzeigen', { exact: true }).click();
    await expect(page).toHaveURL('/show-more/location');
  });

  test('works for single locations', async ({ page }) => {
    await page
      .locator('.overview-selection-container')
      .nth(2)
      .getByRole('tab', { name: 'Orte', exact: true })
      .click();
    // IDs of the six locations shown in tag overview
    for (const [index, id] of [7, 8, 9, 10, 11, 13].entries()) {
      await selection(page, 'Orte')
        .locator('.overview-collection-grid-container .items .item')
        .nth(index)
        .click();
      await expect(page).toHaveURL(`/show-more/location/${id}`);
      await page.goBack();
    }
  });

  test('works for "Unsere Kategorien"', async ({ page }) => {
    await overview(page, 'Unsere Kategorien').getByText('Mehr anzeigen', { exact: true }).click();
    await expect(page).toHaveURL('/show-more/keyword');
  });

  test('works for single keywords', async ({ page }) => {
    // IDs of the six keywords shown in tag overview
    for (const [index, id] of [9, 10, 11, 13, 14, 15].entries()) {
      await overview(page, 'Unsere Kategorien')
        .locator('.overview-collection-grid-container .items .item')
        .nth(index)
        .click();
      await expect(page).toHaveURL(`/show-more/keyword/${id}`);
      await page.goBack();
    }
  });
});

test.describe('Navigation to Show More View from Archive View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/archives/1');
  });

  test('works for "Unsere Bilder"', async ({ page }) => {
    await selection(page, 'Unsere Bilder').getByText('Mehr anzeigen', { exact: true }).click();
    await expect(page).toHaveURL('/archives/1/show-more/pictures');
  });

  test('works for "Unsere Kategorien"', async ({ page }) => {
    await overview(page, 'Unsere Kategorien').getByText('Mehr anzeigen', { exact: true }).click();
    await expect(page).toHaveURL('/archives/1/show-more/keyword');
  });

  test('works for single keywords', async ({ page }) => {
    // IDs of the six keywords shown in tag overview
    for (const [index, id] of [9, 10, 11, 13, 14, 15].entries()) {
      await overview(page, 'Unsere Kategorien')
        .locator('.overview-collection-grid-container .items .item')
        .nth(index)
        .click();
      await expect(page).toHaveURL(`/archives/1/show-more/keyword/${id}`);
      await page.goBack();
    }
  });
});

test.describe('Global Show More View', () => {
  test('shows show more for "Neuzugänge"', async ({ page }) => {
    await page.goto('/show-more/latest');
    await expectText(page, 'Neuzugänge');
    await expectText(
      page,
      'Hier fließen die jüngsten 500 „Neuzugänge“ der Fotoarchive ein. Wer den schnellen Überblick haben möchte, welche Bilder aktuell gescannt und eingearbeitet wurden, ist hier richtig.'
    );
    await expectText(page, 'Mehr als 100 Bilder');
    await expectPictures(page, [2, 3, 4, 5]);
  });

  test('shows show more for "Wissen Sie mehr über diese Bilder?"', async ({ page }) => {
    await page.goto('/show-more/pictures/Fragezeichen');
    await expectText(page, 'Fragezeichen');
    await expectText(page, 'Fragezeichen Collection Testbeschreibung');
    await expectText(page, '4 Bilder');
    await expectPictures(page, [2, 3, 4, 5]);
  });

  test('shows show more view for "Jahrzehnte"', async ({ page }) => {
    await page.goto('/show-more/date');
    await expectText(page, 'Jahrzehnte');
    await expectText(
      page,
      'Hier finden Sie alle Bilder unseres Archivs aus den bestimmten Jahrzehnten.'
    );
    for (const [index, decade] of ['FRÜHER', '50ER', '60ER', '70ER', '80ER', '90ER'].entries()) {
      await expect(items(page).locator('.item').nth(index)).toContainText(decade);
    }
  });

  test('shows show more view for single decade "70er"', async ({ page }) => {
    await page.goto('/show-more/date/7');
    await expectText(page, '1970er');
    await expectText(page, '2 Bilder');
    await expectPictures(page, [4, 5]);
  });

  test('shows show more view for "Orte', async ({ page }) => {
    await page.goto('/show-more/location');
    await expectText(page, 'Orte');
    await expectText(page, 'Hier finden Sie alle Orte unseres Archivs');
    for (const num of [1, 2, 3, 4, 5, 6, 7]) {
      await expect(items(page)).toContainText(`VERIFIZIERTER TESTORT ${num}`);
    }
  });

  test('shows show more for single location "Verifizierter Testort 3"', async ({ page }) => {
    await page.goto('/show-more/location/9');
    await expectText(page, 'Verifizierter Testort 3');
    await expectText(page, '1 Bild');
    await expectPictures(page, [4]);
  });

  test('shows show more view for "Unsere Kategorien"', async ({ page }) => {
    await page.goto('/show-more/keyword');
    await expectText(page, 'Unsere Kategorien');
    await expectText(page, 'Hier finden Sie alle thematischen Kategorien unseres Archivs');
    for (const num of [2, 3, 4, 5, 6, 7]) {
      await expect(items(page)).toContainText(`VERIFIZIERTES TESTSCHLAGWORT ${num}`);
    }
    await expectText(page, 'Mehr als 100 Bilder');
    await expectPictures(page, [2, 3, 4, 5]);
  });

  test('shows show more for single keyword "Verifiziertes Testschlagwort 4"', async ({ page }) => {
    await page.goto('/show-more/keyword/11');
    await expectText(page, 'Verifiziertes Testschlagwort 4');
    await expectText(page, '1 Bild');
    await expectPictures(page, [4]);
  });
});

test.describe('Archive Show More View', () => {
  test('shows show more for "Unsere Bilder"', async ({ page }) => {
    await page.goto('/archives/1/show-more/pictures');
    await expectText(page, 'Unsere Bilder');
    await expectText(page, 'Hier finden Sie alle Bilder dieses Archivs');
    await expectText(page, '5 Bilder');
    await expectPictures(page, [1, 2, 3, 4, 5]);
  });

  test('shows show more view for "Unsere Kategorien"', async ({ page }) => {
    await page.goto('/archives/1/show-more/keyword');
    await expectText(page, 'Unsere Kategorien');
    await expectText(page, 'Hier finden Sie alle thematischen Kategorien unseres Archivs');
    for (const num of [2, 3, 4, 5, 6, 7]) {
      await expect(items(page)).toContainText(`VERIFIZIERTES TESTSCHLAGWORT ${num}`);
    }
    await expectText(page, '5 Bilder');
    await expectPictures(page, [1, 2, 3, 4, 5]);
  });

  test('shows show more for single keyword "Verifiziertes Testschlagwort 4"', async ({ page }) => {
    await page.goto('/archives/1/show-more/keyword/11');
    await expectText(page, 'Verifiziertes Testschlagwort 4');
    await expectText(page, '1 Bild');
    await expectPictures(page, [4]);
  });
});
