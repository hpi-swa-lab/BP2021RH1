import { type Page } from '@playwright/test';
import { expectText, step } from './helper';
import { expect, test } from './test';

test.describe('location management', () => {
  test.use({ curator: true });

  const entry = (page: Page, name: string) =>
    page
      .locator('.location-entry-container')
      .filter({ has: page.locator('.location-name').getByText(name, { exact: true }) });

  const visitLocations = async (page: Page) => {
    await page.goto('/tags/locations');
    await expect(entry(page, 'Bad Harzburg')).toBeVisible();
  };

  const deleteLocation = (page: Page, name: string) =>
    step(`delete ${name}`, async () => {
      await entry(page, name).getByRole('button', { name: 'Ort löschen.', exact: true }).click();
      const dialog = page.getByRole('dialog');
      await expectText(dialog, 'Soll folgender Ort und alle seine Unterorte gelöscht werden?');
      await dialog.getByRole('button', { name: 'Bestätigen', exact: true }).click();
    });

  // Every location in the test data has pictures, so the test adds one under Testort 1
  test('deletes a location without sub-locations', async ({ page }) => {
    const showSubLocations = async () => {
      await entry(page, 'Testort 1').locator('.show-more-button').click();
      await expect(
        page.getByText('Unterort für Testort 1 hinzufügen.', { exact: true })
      ).toBeVisible();
    };
    await visitLocations(page);
    await step('add Neuer Ort', async () => {
      await showSubLocations();
      await page.getByText('Unterort für Testort 1 hinzufügen.', { exact: true }).click();
      const dialog = page.getByRole('dialog');
      await dialog.getByRole('textbox').fill('Neuer Ort');
      await dialog.getByRole('button', { name: 'Bestätigen', exact: true }).click();
      await expect(entry(page, 'Neuer Ort')).toBeVisible();
    });
    await deleteLocation(page, 'Neuer Ort');
    await expect(entry(page, 'Neuer Ort')).toHaveCount(0);
    await visitLocations(page);
    await showSubLocations();
    await expect(entry(page, 'Neuer Ort')).toHaveCount(0);
  });

  // Market place has one picture and three verified ones
  test('refuses to delete a location with pictures', async ({ page }) => {
    await visitLocations(page);
    await deleteLocation(page, 'Market place');
    const dialog = page.getByRole('dialog');
    await expectText(dialog, 'Für diesen Ort existieren 4 Bilder.');
    await dialog.getByRole('button', { name: 'Bestätigen', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await visitLocations(page);
    await expect(entry(page, 'Market place')).toBeVisible();
  });
});
