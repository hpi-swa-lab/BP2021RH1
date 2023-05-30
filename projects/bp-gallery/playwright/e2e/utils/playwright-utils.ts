import { Page, expect } from "@playwright/test";

export class PlaywrightUtils {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async login() {
        await this.page.goto("/");
        await this.page.getByText("Login").click();
        await this.page.getByLabel("Nutzername").fill("testCurator");
        await this.page.getByLabel("Passwort").fill("1234abc");
        await this.page.getByRole("button", {name: "LOGIN"}).click();
        await expect(this.page.getByText("Erfolgreich eingeloggt")).toHaveCount(1);
    }

    async logout() {
        await this.page.goto("/");
        await this.page.getByText("Logout").click();
        await expect(this.page.getByText("Erfolgreich ausgeloggt")).toHaveCount(1);
    };
    
    async postComment(name: string, comment: string) {
        (await this.page.waitForSelector('input#name')).scrollIntoViewIfNeeded;
        await this.page.fill('input#name', '');
        await this.page.fill('input#name', name);
        await this.page.fill('textarea#text', '');
        await this.page.fill('textarea#text', comment);
        await this.page.click('.MuiButton-root:has-text("Absenden")');
    }

    async closeModal (text:string, buttonText:string) {
        await this.page.locator('.MuiDialog-container:has-text("' + text + '")');
        // await expect(this.page.locator('.MuiDialog-container')).toHaveText(text);
        await this.page.locator('.MuiDialog-root:has-text("' + buttonText + '")');
        // await expect(this.page.locator('.MuiButton-root')).toHaveText(buttonText);
        await this.page.click('.MuiButton-root:has-text("' + buttonText + '")');
    }
}