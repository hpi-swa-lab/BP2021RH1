import { expectText, infoField, waitForCuratorPictureInfo } from './helper';
import { expect, test } from './test';

test.describe('Picture View called via link', () => {
  test.beforeEach(({ page }) => page.goto('/picture/1'));

  test('should display a toolbar', async ({ page }) => {
    await expect(page.locator('.picture-toolbar')).toBeVisible();
  });

  test('should show picture information after opening the sidebar', async ({ page }) => {
    await expect(page.locator('.picture-sidebar')).toBeVisible();
    await expectText(page, 'Bad Harzburg');
    await page.locator('.picture-sidebar .quick-access-buttons').click();
    await expect(page.locator('.picture-sidebar')).toHaveClass(/\bclosed\b/);
  });

  test('should return to the homepage when pressing the back button', async ({ page }) => {
    await page.locator('.picture-toolbar button').first().click();
    await expect(page).toHaveURL('/start');
  });
});

test.describe('Picture View called via link as a curator', () => {
  test.use({ curator: true });
  test.beforeEach(({ page }) => page.goto('/picture/1'));

  test('should show a picture-info-field for each type in the picture sidebar', async ({
    page,
  }) => {
    const pictureInfoFields = [
      'date',
      'description',
      'person',
      'location',
      'keywords',
      'links',
      'collections',
      'archive',
    ];

    await expect(page.locator('.picture-sidebar .quick-access-buttons')).toContainText('Vollbild');
    await expect(page.locator('.picture-info-field')).toHaveCount(pictureInfoFields.length);
  });

  test('should have date estimate functionality', async ({ page }) => {
    const checkbox = page.locator('.date-range-picker .MuiCheckbox-root');
    await page.locator('.date-indicator').click();
    await expect(checkbox).not.toHaveClass(/Mui-checked/);
    await checkbox.click();
    await expect(checkbox).toHaveClass(/Mui-checked/);
    await checkbox.click();
    await expect(checkbox).not.toHaveClass(/Mui-checked/);
    await page.keyboard.press('Escape');
  });
});

test.describe('Tag lists in the picture sidebar', () => {
  test.use({ curator: true });

  test('load only when their field opens', async ({ page }) => {
    const lists = [
      'getAllKeywordTags',
      'getAllLocationTags',
      'getAllPersonTags',
      'getAllCollections',
    ];
    const requested: string[] = [];
    page.on('request', request => {
      if (request.url().endsWith('/graphql') && request.method() === 'POST') {
        const operations = [request.postDataJSON()].flat() as { operationName?: string }[];
        requested.push(...operations.map(operation => operation.operationName ?? ''));
      }
    });
    const requestedLists = () => requested.filter(name => lists.includes(name));

    await page.goto('/picture/1');
    await waitForCuratorPictureInfo(page);
    await page.waitForLoadState('networkidle');
    expect(requestedLists()).toEqual([]);

    const input = infoField(page, 'Schlagworte').locator('input');
    await input.click();
    await input.fill('wine');
    await expect(page.getByRole('option', { name: 'wine', exact: true })).toBeVisible();
    expect(requestedLists()).toEqual(['getAllKeywordTags']);
  });

  test('load when their field opened before the permission check answered', async ({ page }) => {
    let answer = () => {};
    const answered = new Promise<void>(resolve => (answer = resolve));
    await page.route('**/graphql', async route => {
      const operations = [route.request().postDataJSON()].flat() as {
        variables?: { operation?: string; withSomeVariables?: boolean };
      }[];
      // The check with its own variables, asked after the one whether the user may list
      // collections at all
      const holdsCheck = operations.some(
        ({ variables }) =>
          variables?.operation?.includes('query getAllCollections') && !variables.withSomeVariables
      );
      if (holdsCheck) await answered;
      await route.continue();
    });
    await page.goto('/picture/1');
    const input = infoField(page, 'Collections').locator('input');
    await input.click();
    // Picture 1 isn't in this collection, so only the loaded list can offer it
    await input.fill('Collection 2');
    answer();
    await expect(page.getByRole('option', { name: 'Collection 2', exact: true })).toBeVisible();
  });
});

test('the like button counts a like and takes it back', async ({ page }) => {
  await page.goto('/picture/1');
  const like = page.getByRole('button', { name: /Mag ich$/ });
  await expect(like).toContainText('0');
  await like.click();
  await expect(like).toContainText('1');
  await page.reload();
  await expect(like).toContainText('1');
  await like.click();
  await expect(like).toContainText('0');
  await page.reload();
  await expect(like).toContainText('0');
});
