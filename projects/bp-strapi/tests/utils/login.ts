import { expect } from "@playwright/test";

export const login = async ({page}) =>  {
    await page.goto("/");
    await page.getByText("Login").click();
    await page.getByLabel("Nutzername").fill("testCurator");
    await page.getByLabel("Passwort").fill("1234abc");
    await page.getByRole("button", {name: "LOGIN"}).click();
    await expect(page.getByText("Erfolgreich eingeloggt")).toHaveCount(1);
}