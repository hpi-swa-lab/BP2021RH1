import { type Page } from '@playwright/test';
import {
  chip,
  expectNoText,
  expectSaved,
  expectText,
  login,
  logout,
  text,
  caseSensitive,
} from './helper';
import { expect, test } from './test';

test.describe('face tagging', () => {
  test.describe.configure({ mode: 'serial' });
  test.use({ freshData: false });
  let page: Page;
  test.beforeAll(async ({ browser, resetData }) => {
    await resetData();
    page = await browser.newPage();
    await page.goto('/');
    await login(page);
    await page.goto('/picture/1');
  });
  test.afterAll(() => page.close());

  const facetag = (name: string) => page.locator('.facetag', { hasText: caseSensitive(name) });
  const picture = () => page.locator('.picture');
  const box = async () => (await picture().boundingBox())!;
  // Clicks the picture at a point given as fractions of its width and height; the toolbar
  // covers its top edge
  const clickPicture = async (x = 0.5, y = 0.5) => {
    const { width, height } = await box();
    await picture().click({ position: { x: x * width, y: y * height }, force: true });
  };
  const addPerson = async (name: string) => {
    const input = page
      .locator('.field-content', { hasText: caseSensitive('Personen') })
      .locator('input');
    await input.click();
    await input.fill(name);
    await expectSaved(page, () => page.getByText(`${name} hinzufügen`, { exact: true }).click());
  };

  test('create face tags', async () => {
    await test.step('shows no face tags and no face tag buttons', async () => {
      await expect(page.locator('.facetag')).toHaveCount(0);
      await expectNoText(page, 'Personen markieren');
      await expectNoText(page, 'Personenmarkierungen ausblenden');
      await expectNoText(page, 'Personenmarkierungen anzeigen');
    });

    await test.step('add two persons', async () => {
      await addPerson('TestPerson');
      await addPerson('Personentest');
      await text(page, 'Personen markieren').click();
      await expectText(page, 'Personen bearbeiten');
    });

    await test.step('tag TestPerson', async () => {
      await text(page, 'TestPerson').first().click();
      // above the middle, so that the tags don't overlap
      await clickPicture(0.02, 0.3);
      await expect(facetag('TestPerson').getByTestId('CancelIcon')).toBeVisible();
    });

    await test.step('tag Personentest', async () => {
      await text(page, 'Personentest').first().click();
      await clickPicture();
      await expect(facetag('Personentest').getByTestId('CancelIcon')).toBeVisible();
    });
  });

  const toggleFacetags = async () => {
    await text(page, 'Personenmarkierungen ausblenden').click();
    await expect(page.locator('.facetag')).toHaveCount(0);
    await expectNoText(page, 'Personenmarkierungen ausblenden');
    await text(page, 'Personenmarkierungen anzeigen').click();
    await expect(page.locator('.facetag')).toHaveCount(2);
    await expectText(page, 'Personenmarkierungen ausblenden');
  };

  test('hide and display facetags', async () => {
    await test.step('as curator', async () => {
      await text(page, 'Personen bearbeiten').click();
      await expectNoText(page, 'Personenmarkierungen anzeigen');
      await toggleFacetags();
    });

    await test.step('as visitor', async () => {
      await page.goto('/');
      await logout(page);
      await page.goto('/picture/1');
      await expect(page.locator('.facetag')).toHaveCount(2);
      await expectNoText(page, 'Personen markieren');
      await expectNoText(page, 'Personen bearbeiten');
      await expectNoText(page, 'Personenmarkierungen anzeigen');
      await toggleFacetags();
    });
  });

  test('delete and move facetags', async () => {
    await page.goto('/');
    await login(page);
    await page.goto('/picture/1');
    await text(page, 'Personen markieren').click();

    await test.step("delete TestPerson's face tag", async () => {
      await expect(chip(page, 'TestPerson')).toBeVisible();
      await facetag('TestPerson').getByTestId('CancelIcon').click();
      await expect(facetag('TestPerson')).toHaveCount(0);
    });

    await test.step("move Personentest's face tag", async () => {
      await expect(chip(page, 'Personentest')).toBeVisible();
      await facetag('Personentest').getByTestId('OpenWithIcon').click();
      await expect(facetag('Personentest').getByTestId('OpenWithIcon')).toHaveCount(0);
      await clickPicture(0.02);
      await expect(facetag('Personentest').getByTestId('OpenWithIcon')).toBeVisible();
    });

    await test.step('removing Personentest from the picture removes its face tag', async () => {
      await text(page, 'Personen bearbeiten').click();
      await expect(facetag('Personentest')).toBeVisible();
      await expectSaved(page, () => chip(page, 'Personentest').getByTestId('CancelIcon').click());
      await expect(chip(page, 'Personentest')).toHaveCount(0);
      await expect(facetag('Personentest')).toHaveCount(0);
    });
  });

  test('change face tag direction', async () => {
    await expectNoText(page, 'Personen bearbeiten');
    await text(page, 'Personen markieren').click();
    await text(page, 'TestPerson').first().click();
    await clickPicture();

    for (const [x, y, direction] of [
      [0.5, 0.2, 'up'],
      [0.98, 0.5, 'right'],
      [0.5, 0.8, 'down'],
      [0.02, 0.5, 'left'],
    ] as const) {
      await test.step(`turn the face tag ${direction}`, async () => {
        await facetag('TestPerson').getByTestId('AutorenewIcon').click();
        await clickPicture(x, y);
        await expect(
          facetag('TestPerson').getByTestId(`tag direction: ${direction}`)
        ).toBeAttached();
      });
    }
  });
});
