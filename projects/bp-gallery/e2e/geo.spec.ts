import { type Page } from '@playwright/test';
import { expect, test } from './test';

test.describe('Geo View', () => {
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false });
  let page: Page;
  let oldPictureId: string | null = null;
  test.beforeAll(async ({ browser, resetData }) => {
    await resetData();
    page = await browser.newPage();
    await page.goto('/geo');
  });
  test.afterAll(() => page.close());

  const geoImage = () => page.getByTestId('geo-image');

  test('shows modal with button', async () => {
    await expect(page.locator('.modal')).toContainText(
      'Hilf uns Ortskoordinaten ausfindig zu machen!'
    );
    await page.getByTestId('dont-show-again-button').click();
    await expect(page.locator('.modal')).toHaveCount(0);
  });

  test('shows an image and a map', async () => {
    await expect(page.locator('.picture-container > *')).toHaveAttribute('src', /\/uploads\//);
    oldPictureId = await geoImage().getAttribute('data-pictureId');
    await expect(page.locator('.map-container')).toBeVisible();
  });

  test('shows a marker on click on the map', async () => {
    await page.locator('.map-container').click();
    await expect(page.locator('.leaflet-marker-icon')).toBeVisible();
  });

  test('shows guess complete when guess is submitted', async () => {
    await page.getByTestId('submit-guess').click();
    await expect(page.locator('.guess-complete-text')).toBeVisible();
  });

  test('shows new picture when guess is submitted', async () => {
    await page.getByTestId('next-picture').click();
    await expect(geoImage()).toHaveAttribute('data-pictureId', /.+/);
    await expect(geoImage()).not.toHaveAttribute('data-pictureId', oldPictureId ?? '');
  });

  test("shows completed guess when user don't know the location", async () => {
    await page.getByTestId('dont-know').click();
    await expect(page.locator('.guess-complete-text')).toContainText(
      'Beim nächsten Bild weißt du es!'
    );
    await page.getByTestId('next-picture').click();
  });

  test("shows directly the next picture when this isn't a picture", async () => {
    await page.getByTestId('not-a-place').click();
    await expect(page.getByTestId('next-picture')).toHaveCount(0);
  });
});
