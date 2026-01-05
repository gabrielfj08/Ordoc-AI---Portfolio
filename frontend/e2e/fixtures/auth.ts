import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Fixture customizada para testes com autenticação
 */
export const test = base.extend<{
  authenticatedPage: Page
}>({
  authenticatedPage: async ({ page }, use) => {
    // Navegar para a página de login
    await page.goto('/login')

    // Preencher formulário de login
    // Nota: Ajuste as credenciais conforme necessário
    await page.fill('#email', process.env.TEST_USER || 'admin@ordoc.ai')
    await page.fill('#password', process.env.TEST_PASSWORD || 'admin123')

    // Clicar no botão de login e aguardar redirect
    await Promise.all([
      page.waitForURL('/my-day', { timeout: 15000 }),
      page.click('button[type="submit"]')
    ])

    // Verificar que o login foi bem-sucedido
    await expect(page).toHaveURL('/my-day')

    // Usar a página autenticada nos testes
    await use(page)
  },
})

export { expect }
