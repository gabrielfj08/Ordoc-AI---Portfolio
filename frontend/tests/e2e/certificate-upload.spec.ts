import { test, expect, Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', process.env.E2E_USER_EMAIL ?? 'user@example.com');
  await page.fill('input[name="password"]', process.env.E2E_USER_PASSWORD ?? 'password');
  await page.click('button:has-text("Entrar")');
}

test('usuario pode fazer upload de certificado', async ({ page }) => {
  await login(page);
  await page.goto('/dashboard/ordoc-sign/certificates/new');
  await page.setInputFiles('input[type="file"]', 'tests/e2e/fixtures/dummy-cert.p12');
  await page.click('button:has-text("Fazer Upload")');
  await expect(page).toHaveURL(/certificates/);
});
