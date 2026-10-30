import { type Page } from '@playwright/test';
import { caseSensitive } from './helper';
import { expect, test as base } from './test';

const message = 'Wer ist auf dem Bild zu sehen?';

type Mail = { Subject: string; To: { Address: string }[] };

// The emails in the stack's Mailpit, which starts empty for each test
const test = base.extend<{ mails: () => Promise<Mail[]> }>({
  mails: async ({ request, stack }, use) => {
    const messages = `${stack.mailpit}/api/v1/messages`;
    await request.delete(messages);
    await use(
      async () => ((await (await request.get(messages)).json()) as { messages: Mail[] }).messages
    );
  },
});

const field = (page: Page, label: string, element = 'input') =>
  page.locator('label', { hasText: caseSensitive(label) }).locator(element);

const fillForm = async (page: Page, subject: string) => {
  await page.goto('/contact');
  await expect(
    page.getByText('Herbert-Ahrens-Bilderarchiv', { exact: true }).first()
  ).toBeVisible();
  await field(page, 'Name').fill('Erika Muster');
  await field(page, 'Ihre E-Mail').fill('erika@example.com');
  await field(page, 'Betreff').fill(subject);
  await field(page, 'Nachricht', 'textarea:not([aria-hidden])').fill(message);
};

const expectRejected = async (page: Page, mails: () => Promise<Mail[]>) => {
  await expect(
    page.getByText('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', {
      exact: true,
    })
  ).toBeVisible();
  await expect(field(page, 'Nachricht', 'textarea:not([aria-hidden])')).toHaveValue(message);
  expect(await mails()).toHaveLength(0);
};

test.describe('Contact form', () => {
  let now = 0;
  // The server rejects messages sent within 3 seconds of opening the form as automated
  const waitThreeSeconds = (page: Page) => page.clock.setFixedTime(now + 3000);

  test.beforeEach(async ({ page }) => {
    now = Date.now();
    await page.clock.setFixedTime(now);
  });

  test('sends the message to the archive by email', async ({ page, mails }) => {
    await fillForm(page, 'Frage zu Bild 1');
    await waitThreeSeconds(page);
    await page.getByText('Anfrage versenden', { exact: true }).click();
    await expect(page.getByText('Ihre Nachricht ist eingegangen.', { exact: true })).toBeVisible();

    await expect.poll(() => mails()).toHaveLength(1);
    const [mail] = await mails();
    expect(mail.Subject).toBe('Neue Nachricht über das Kontaktformular: Frage zu Bild 1');
    expect(mail.To[0].Address).toBe('archiv@example.com');
  });

  test('tags a random-looking subject but still sends it', async ({ page, mails }) => {
    await fillForm(page, 'aZLYEpmJitLYJWMqkMg');
    await waitThreeSeconds(page);
    await page.getByText('Anfrage versenden', { exact: true }).click();
    await expect(page.getByText('Ihre Nachricht ist eingegangen.', { exact: true })).toBeVisible();

    await expect.poll(() => mails()).toHaveLength(1);
    expect((await mails())[0].Subject).toBe(
      '[Spamverdacht] Neue Nachricht über das Kontaktformular: aZLYEpmJitLYJWMqkMg'
    );
  });

  test('rejects a message sent within 3 seconds and sends it on retry', async ({ page, mails }) => {
    await fillForm(page, 'Frage zu Bild 1');
    await page.getByText('Anfrage versenden', { exact: true }).click();
    await expectRejected(page, mails);

    await waitThreeSeconds(page);
    await page.getByText('Anfrage versenden', { exact: true }).click();
    await expect(page.getByText('Ihre Nachricht ist eingegangen.', { exact: true })).toBeVisible();
    await expect.poll(() => mails()).toHaveLength(1);
  });

  test('rejects a message with the hidden field filled in', async ({ page, mails }) => {
    await fillForm(page, 'Frage zu Bild 1');
    await page.locator('input[name="contact_check"]').fill('https://spam.example.com', {
      force: true,
    });
    await waitThreeSeconds(page);
    await page.getByText('Anfrage versenden', { exact: true }).click();
    await expectRejected(page, mails);
  });
});
