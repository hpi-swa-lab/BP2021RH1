import { expect, test } from '@playwright/test';
import { login } from './utils/login';

test.fixme("login", async ({page}) => {
    login;
    await expect(page.getByRole("button", {name: "Logout"})).toHaveCount(1);
})