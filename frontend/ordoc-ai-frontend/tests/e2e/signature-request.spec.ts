import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', process.env.E2E_USER_EMAIL ?? 'user@example.com');
  await page.fill('input[name="password"]', process.env.E2E_USER_PASSWORD ?? 'password');
  await page.click('button:has-text("Entrar")');
}

test('usuario pode criar solicitacao de assinatura', async ({ page }) => {
  await login(page);
  await page.goto('/dashboard/ordoc-sign/requests/new');
  await page.fill('input[placeholder="Digite o título da solicitação"]', 'Teste E2E');
  await page.setInputFiles('input[type="file"]', 'tests/e2e/fixtures/dummy.pdf');
  await page.fill('input[placeholder="Nome completo"]', 'Signatario Teste');
  await page.fill('input[placeholder="email@exemplo.com"]', 'signatario@example.com');
  await page.click('button:has-text("Criar Solicitação")');
  await expect(page).toHaveURL(/requests/);
});
