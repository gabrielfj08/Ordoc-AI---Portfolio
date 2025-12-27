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
    await page.fill('input[name="username"]', process.env.TEST_USER || 'admin')
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD || 'admin')
    
    // Clicar no botão de login
    await page.click('button[type="submit"]')
    
    // Aguardar redirect após login bem-sucedido
    await page.waitForURL('/', { timeout: 10000 })
    
    // Verificar que o login foi bem-sucedido
    await expect(page).toHaveURL('/')
    
    // Usar a página autenticada nos testes
    await use(page)
  },
})

export { expect }
