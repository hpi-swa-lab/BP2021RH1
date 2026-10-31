import { type Page } from '@playwright/test';
import {
  bulkEdit,
  expectNoText,
  expectText,
  selectPictures,
  step,
  visitStartAndLoadNextPage,
} from '../helper';
import { expect } from '../test';

// Each spec links its own pictures and texts, so that the specs can run on different stacks

export const links = (page: Page) => page.locator('.picture-info-field[data-type="links"]');

export const linked = (page: Page, id: string) => links(page).locator(`#picture-preview-for-${id}`);

const markAsText = (page: Page) =>
  page.getByRole('button', { name: 'Als Text markieren', exact: true });

// The start page lists the newest pictures first, so 30 to 48 are on its second page
export const bulkEditOnStart = (page: Page, ids: string[]) =>
  step(`bulk edit ${ids.join(', ')}`, async () => {
    await visitStartAndLoadNextPage(page);
    await selectPictures(page, ...ids);
    await bulkEdit(page);
    await expectNoText(page, 'Lädt...');
  });

export const copy = (page: Page, button: string, ids: string[]) =>
  step(`copy ${ids.join(', ')}`, async () => {
    const clipboard = page.locator('.clipboard-editor');
    await page.locator('.clipboard-editor-open').click();
    await expectText(clipboard, 'Keine Bilder');
    await clipboard.getByRole('button', { name: button, exact: true }).click();
    for (const id of ids) {
      await expect(clipboard.locator(`#picture-preview-for-${id}`)).toBeVisible();
    }
    await expectNoText(clipboard, 'Keine Bilder');
  });

export const paste = (page: Page, button: string) =>
  step(`paste with ${button}`, async () => {
    await expectNoText(page, 'Lädt...');
    await links(page).getByRole('button', { name: button, exact: true }).click();
  });

export const expectLinks = (page: Page, ids: string[], linkedIds: string[]) =>
  step(`${ids.join(', ')} link to ${linkedIds.join(', ')}`, async () => {
    for (const id of ids) {
      await page.goto(`/picture/${id}`);
      for (const linkedId of linkedIds) await expect(linked(page, linkedId)).toBeVisible();
    }
  });

export const expectNoLinks = (page: Page, ids: string[]) =>
  step(`${ids.join(', ')} have no links`, async () => {
    for (const id of ids) {
      await page.goto(`/picture/${id}`);
      await expect(links(page)).toBeVisible();
      await expectNoText(page, 'Lädt...');
      await expect(links(page).locator('.picture-preview')).toHaveCount(0);
    }
  });

export const markAsTexts = async (page: Page, ids: string[]) => {
  await bulkEditOnStart(page, ids);
  await expectText(page, 'Verlinkte Texte');
  await expect(markAsText(page).getByTestId('CheckBoxOutlineBlankIcon')).toBeVisible();
  await markAsText(page).click();
  await expect(markAsText(page).getByTestId('CheckBoxIcon')).toBeVisible();
  await expectText(page, 'Verlinkte Bilder');
  for (const id of ids) {
    await page.goto(`/picture/${id}`);
    await expectText(page, 'Verlinkte Bilder');
  }
};

export const expectCannotMarkAsPictures = async (page: Page, ids: string[]) => {
  await bulkEditOnStart(page, ids);
  await expectText(page, 'Verlinkte Bilder');
  await expect(markAsText(page).getByTestId('CheckBoxIcon')).toBeVisible();
  await markAsText(page).click();
  await expectText(page, 'Es sind noch Bilder verlinkt');
  await page.getByRole('button', { name: 'O.K.', exact: true }).click();
  await expect(markAsText(page).getByTestId('CheckBoxIcon')).toBeVisible();
};

export const markAsPictures = async (page: Page, ids: string[]) => {
  await bulkEditOnStart(page, ids);
  await expectText(page, 'Verlinkte Bilder');
  await expect(markAsText(page).getByTestId('CheckBoxIcon')).toBeVisible();
  await markAsText(page).click();
  await expect(markAsText(page).getByTestId('CheckBoxOutlineBlankIcon')).toBeVisible();
  await expectText(page, 'Verlinkte Texte');
  for (const id of ids) {
    await page.goto(`/picture/${id}`);
    await expectText(page, 'Verlinkte Texte');
  }
};

export const removeLink = async (page: Page, selected: string[], linkedId: string) => {
  await bulkEditOnStart(page, selected);
  await linked(page, linkedId).getByTestId('LinkOffIcon').click();
  await expectNoText(page, 'Lädt...');
  await expect(links(page).locator('.picture-preview')).toHaveCount(0);
  await expectNoLinks(page, [...selected, linkedId]);
};

export const removeAllLinks = async (page: Page, selected: string[], others: string[]) => {
  await bulkEditOnStart(page, selected);
  await page.getByRole('button', { name: 'Alle Links entfernen', exact: true }).click();
  await page.getByRole('button', { name: 'Bestätigen', exact: true }).click();
  await expectNoText(page, 'Lädt...');
  await expect(links(page).locator('.picture-preview')).toHaveCount(0);
  await expectNoLinks(page, [...selected, ...others]);
};
