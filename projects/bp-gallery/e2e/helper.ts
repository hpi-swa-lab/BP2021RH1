import { expect, test, type Locator, type Page } from '@playwright/test';

// Steps name the helper calls in the report; box makes a failure point at the call in the spec
export const step = <T>(title: string, body: () => Promise<T>) =>
  test.step(title, body, { box: true });

export const submitLogin = async (page: Page, username: string, password: string) => {
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Nutzername', { exact: true }).fill(username);
  await dialog.getByLabel('Passwort', { exact: true }).fill(password);
  await dialog.getByRole('button', { name: 'Login', exact: true }).click();
};

export const login = async (page: Page) => {
  await page.locator('.nav-element', { hasText: caseSensitive('Login') }).click();
  await submitLogin(page, 'testCurator', '1234abc');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.nav-element', { hasText: caseSensitive('Logout') })).toBeVisible();
};

export const logout = async (page: Page) => {
  await page.locator('.nav-element', { hasText: caseSensitive('Logout') }).click();
  await expect(page.locator('.nav-element', { hasText: caseSensitive('Login') })).toBeVisible();
};

export const caseSensitive = (value: string) =>
  new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

// The visible elements with the text, case-sensitive
export const text = (scope: Page | Locator, value: string) =>
  scope.getByText(caseSensitive(value)).filter({ visible: true });

export const expectText = (scope: Page | Locator, value: string) =>
  expect(text(scope, value).first()).toBeVisible();

export const expectNoText = (scope: Page | Locator, value: string) =>
  expect(text(scope, value)).toHaveCount(0);

export const pictureStepTitle = (id: string, shown: string[], hidden: string[]) =>
  `picture ${id} shows ${shown.join(', ') || 'nothing'}` +
  (hidden.length ? `, not ${hidden.join(', ')}` : '');

export const expectPicture = (page: Page, id: string, shown: string[], hidden: string[] = []) =>
  step(pictureStepTitle(id, shown, hidden), async () => {
    await page.goto(`/picture/${id}`);
    for (const value of shown) await expectText(page, value);
    for (const value of hidden) await expectNoText(page, value);
  });

// The page's scroll container comes before those of the clipboard and the link fields
export const scrollToBottom = (page: Page) =>
  page
    .getByTestId('scrollable-container')
    .first()
    .evaluate(container => container.scrollTo(0, container.scrollHeight));

export const waitForAllImagesLoaded = (page: Page) =>
  expect
    .poll(() =>
      page
        .locator('img')
        .evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalHeight > 0))
    )
    .toBe(true);

export const waitForCuratorPictureInfo = (page: Page) =>
  expect(page.getByTestId('save-status')).toBeVisible();

// The save status reads "Gespeichert." before anything changes, so this waits for the mutation
// the action sends instead
export const expectSaved = async (page: Page, action: () => Promise<void>) => {
  const saved = page.waitForResponse(
    response =>
      response.url().endsWith('/graphql') &&
      ['updatePicture', 'bulkEdit'].includes(
        (response.request().postDataJSON() as { operationName?: string } | null)?.operationName ??
          ''
      )
  );
  await action();
  expect((await saved).ok()).toBe(true);
  await expect(page.getByTestId('save-status')).toHaveText('Gespeichert.');
};

export const infoField = (page: Page, title: string) =>
  page.locator('.picture-info-field', { hasText: caseSensitive(title) });

export const chip = (scope: Page | Locator, value: string) =>
  scope.locator('.MuiChip-root', { hasText: caseSensitive(value) });

export const addTag = (page: Page, field: string, input: string, option: string) =>
  step(`add ${option} to ${field}`, async () => {
    await infoField(page, field).locator('input').fill(input);
    await expectSaved(page, () => page.getByRole('option', { name: option, exact: true }).click());
  });

export const removeTag = (page: Page, value: string) =>
  step(`remove ${value}`, () =>
    expectSaved(page, () => chip(page, value).getByTestId('CancelIcon').click())
  );

export const clickBulkOperation = (page: Page, name: string) =>
  page.getByTitle(name, { exact: true }).click();

export const selectPictures = (page: Page, ...ids: string[]) =>
  step(`select pictures ${ids.join(', ')}`, async () => {
    for (const id of ids) {
      await page
        .locator(`#picture-preview-for-${id}`)
        .getByTitle('Bild auswählen', { exact: true })
        .click();
    }
  });

export const bulkEdit = (page: Page) =>
  step('open bulk edit', () => clickBulkOperation(page, 'Mehrere Bilder editieren'));

export const visitArchive1Pictures = async (page: Page) => {
  await page.goto('/archives/1');
  await page
    .locator('.overview-selection-container', { hasText: caseSensitive('Unsere Bilder') })
    .getByText('Mehr anzeigen', { exact: true })
    .click();
};

// Scrolls again until the grid shows more than its first 100 pictures, since a scroll while the page still
// renders can get lost
export const visitStartAndLoadNextPage = async (page: Page) => {
  await page.goto('/start');
  const previews = page.locator('.picture-grid .picture-preview');
  await expect(previews.first()).toBeVisible();
  await expect(async () => {
    await scrollToBottom(page);
    expect(await previews.count()).toBeGreaterThan(100);
  }).toPass();
};
