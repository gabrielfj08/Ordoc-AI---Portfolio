import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {
    test('deve realizar login com sucesso', async ({ page }) => {
        await page.goto('/login')
        await page.fill('#email', 'admin@ordoc.ai')
        await page.fill('#password', 'admin123')
        await page.click('button[type="submit"]')

        // Verificar redirecionamento
        await expect(page).toHaveURL('/my-day')
        // Verificar elemento da home
        await expect(page.locator('text=Meu Dia')).toBeVisible()
    })

    test('deve exibir erro com credenciais inválidas', async ({ page }) => {
        await page.goto('/login')
        await page.fill('#email', 'wrong@ordoc.ai')
        await page.fill('#password', 'wrongpass')
        await page.click('button[type="submit"]')

        // Verificar mensagem de erro - pode ser um toast ou texto na tela
        // Sonner toast geralmente tem role="status" ou similar, mas text locator é mais simples
        await expect(page.locator('text=Erro').or(page.locator('text=inválida'))).toBeVisible({ timeout: 10000 })
        await expect(page).toHaveURL('/login')
    })

    test('deve realizar logout', async ({ page }) => {
        // Fazer login primeiro
        await page.goto('/login')
        await page.fill('#email', 'admin@ordoc.ai')
        await page.fill('#password', 'admin123')
        await page.click('button[type="submit"]')
        await page.waitForURL('/')

        // Realizar logout
        // Assumindo que o botão de perfil abre um menu com logout
        const profileButton = page.locator('button[aria-label="Menu de usuário"]').or(page.locator('button').filter({ hasText: 'AD' })).first()
        await profileButton.click()

        const logoutButton = page.locator('text=Sair').or(page.locator('text=Logout'))
        await logoutButton.click()

        // Verificar redirecionamento para login
        await expect(page).toHaveURL('/login')
    })
})
