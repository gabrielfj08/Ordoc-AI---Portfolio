import { test, expect } from '@playwright/test';

test('usuario pode fazer login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', process.env.E2E_USER_EMAIL ?? 'user@example.com');
  await page.fill('input[name="password"]', process.env.E2E_USER_PASSWORD ?? 'password');
  await page.click('button:has-text("Entrar")');
  await expect(page).toHaveURL(/dashboard|transition/);
});
