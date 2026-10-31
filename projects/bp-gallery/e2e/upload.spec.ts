import { type Page } from '@playwright/test';
import {
  addTag,
  caseSensitive,
  expectPicture,
  expectSaved,
  expectText,
  infoField,
  step,
  waitForCuratorPictureInfo,
} from './helper';
import { expect, test } from './test';

test.describe('picture upload', () => {
  test.use({ curator: true });

  // Uploads the picture to the archive and gives back its id
  const upload = (page: Page) =>
    step('upload a picture', async () => {
      await page.goto('/uploads-overview');
      await page.locator('.dropzone input').setInputFiles('public/test-image.jpg');
      await page.locator('[data-cy="file-upload"]').click();
      await page.getByRole('combobox', { name: 'Archiv', exact: true }).fill('Herbert-Ahrens');
      await page.getByRole('option', { name: 'Herbert-Ahrens-Bilderarchiv', exact: true }).click();
      const created = page.waitForResponse(
        response =>
          (response.request().postDataJSON() as { operationName?: string } | null)
            ?.operationName === 'createPicture'
      );
      await page.getByRole('button', { name: 'Bestätigen', exact: true }).click();
      const { data } = (await (await created).json()) as {
        data: { createPicture: { data: { id: string } } };
      };
      const id = data.createPicture.data.id;
      await expect(page.locator(`#picture-preview-for-${id}`)).toBeVisible();
      return id;
    });

  const addNewTag = (page: Page, field: string, name: string) =>
    step(`add the new ${name} to ${field}`, async () => {
      await infoField(page, field).locator('input').fill(name);
      await expectSaved(page, () => page.getByText(`${name} hinzufügen`, { exact: true }).click());
    });

  test('tags an uploaded picture', async ({ page }) => {
    const id = await upload(page);
    await page.goto(`/picture/${id}`);
    await waitForCuratorPictureInfo(page);

    await step('set the year', async () => {
      await page.locator('.date-indicator').click();
      const year = page
        .locator('.rdrInputRange', { hasText: caseSensitive('Jahr') })
        .locator('input');
      await expectSaved(page, async () => {
        await year.fill('1000');
        await page.keyboard.press('Escape');
      });
    });
    await step('add a description', async () => {
      const descriptions = infoField(page, 'Beschreibungen');
      await descriptions.locator('.MuiIconButton-root [data-testid="AddIcon"]').click();
      await descriptions.locator('.jodit-wysiwyg:empty').click();
      await page.keyboard.type('Testbeschreibung');
      await expectSaved(page, () =>
        page.locator('.field-title', { hasText: caseSensitive('Beschreibungen') }).click()
      );
    });
    await addNewTag(page, 'Personen', 'Testperson');
    await addNewTag(page, 'Orte', 'Testort');
    await addNewTag(page, 'Schlagworte', 'Testschlagwort');
    await addTag(page, 'Collections', 'Collection 1', 'Collection 1');

    await expectPicture(page, id, [
      '1000',
      'Testbeschreibung',
      'Testperson',
      'Testort',
      'Testschlagwort',
      'Collection 1',
      'Herbert-Ahrens-Bilderarchiv',
    ]);
  });

  test('deletes an uploaded picture', async ({ page }) => {
    const id = await upload(page);
    const preview = page.locator(`#picture-preview-for-${id}`);
    await preview.getByTitle('Bild entfernen', { exact: true }).click();
    await page.getByRole('button', { name: 'Bestätigen', exact: true }).click();
    await expect(preview).toHaveCount(0);
    // The seed data has no pictures outside of collections
    await page.reload();
    await expectText(page, 'Keine Bilder');
  });
});
