import {
  bulkEdit,
  expectNoText,
  expectPicture,
  expectSaved,
  expectText,
  infoField,
  selectPictures,
  visitArchive1Pictures,
  caseSensitive,
} from '../helper';
import { test } from '../test';

test.describe('bulk edit descriptions', () => {
  test.use({ curator: true });

  test('shows the same description as the description', async ({ page }) => {
    await expectPicture(page, '4', ['Yet another description']);
    await expectPicture(page, '5', ['Yet another description']);
    await visitArchive1Pictures(page);
    await selectPictures(page, '4', '5');
    await bulkEdit(page);
    await expectText(page, 'Yet another description');
  });

  test('shows different descriptions as no description', async ({ page }) => {
    await expectPicture(page, '2', ['Yet another description']);
    await expectPicture(page, '3', ['Keine Beschreibung vorhanden'], ['Keine Zeit bekannt']);
    await visitArchive1Pictures(page);
    await selectPictures(page, '2', '3');
    await bulkEdit(page);
    await expectText(page, 'Keine Beschreibung vorhanden');
    await expectNoText(page, 'Keine Zeit bekannt');
  });

  test('shows only the shared descriptions', async ({ page }) => {
    await expectPicture(page, '1', ['Yet another description', 'This is a description!']);
    await expectPicture(page, '2', ['Yet another description'], ['This is a description!']);
    await visitArchive1Pictures(page);
    await selectPictures(page, '1', '2');
    await bulkEdit(page);
    await expectText(page, 'Yet another description');
    await expectNoText(page, 'This is a description!');
  });

  test('adds and deletes descriptions while leaving exclusive descriptions as they are', async ({
    page,
  }) => {
    await expectPicture(
      page,
      '1',
      ['Yet another description', 'This is a description!'],
      ['Irgendwas cooles']
    );
    await expectPicture(
      page,
      '2',
      ['Yet another description'],
      ['This is a description!', 'Irgendwas cooles']
    );
    await visitArchive1Pictures(page);
    await selectPictures(page, '1', '2');
    await bulkEdit(page);
    await test.step('add Irgendwas cooles', async () => {
      const descriptions = infoField(page, 'Beschreibungen');
      await descriptions.locator('.MuiIconButton-root [data-testid="AddIcon"]').click();
      await descriptions.locator('.jodit-wysiwyg:empty').click();
      await page.keyboard.type('Irgendwas cooles');
      await expectSaved(page, () =>
        page.locator('.field-title', { hasText: caseSensitive('Beschreibungen') }).click()
      );
    });

    await expectPicture(page, '1', [
      'Yet another description',
      'This is a description!',
      'Irgendwas cooles',
    ]);
    await expectPicture(
      page,
      '2',
      ['Yet another description', 'Irgendwas cooles'],
      ['This is a description!']
    );

    await visitArchive1Pictures(page);
    await selectPictures(page, '1', '2');
    await bulkEdit(page);
    await test.step('delete Irgendwas cooles', async () => {
      await page
        .locator('.description-wrapper', { hasText: caseSensitive('Irgendwas cooles') })
        .locator('.MuiIconButton-root [data-testid="DeleteIcon"]')
        .click();
      await expectSaved(page, () => page.getByText('Bestätigen', { exact: true }).click());
      await expectText(page, 'Yet another description');
      await expectNoText(page, 'Irgendwas cooles');
    });

    await expectPicture(
      page,
      '1',
      ['Yet another description', 'This is a description!'],
      ['Irgendwas cooles']
    );
    await expectPicture(
      page,
      '2',
      ['Yet another description'],
      ['This is a description!', 'Irgendwas cooles']
    );
  });
});
