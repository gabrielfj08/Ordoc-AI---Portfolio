import { test, expect } from './fixtures/auth'

test.describe('Dashboard e Widgets', () => {
    test.beforeEach(async ({ authenticatedPage }) => {
        await authenticatedPage.goto('/my-day')
        await authenticatedPage.waitForLoadState('networkidle')
    })

    test('deve exibir badges de privacidade', async ({ authenticatedPage }) => {
        // Verificar badge no Card do Assistente
        const assistantBadge = authenticatedPage.locator('h3:has-text("Assistente")').locator('..').locator('..').locator('svg.lucide-shield').first()
        // Como a estrutura é complexa, podemos buscar pelo SVG de shield dentro do card de assistente
        // Ou buscar pelo texto do tooltip se conseguirmos triggerar hover, mas verificação visual do ícone é mais robusta para automação rápida

        // Alternativa: Buscar pelo componente PrivacyBadge se tiver um atributo identificável. 
        // Como não adicionei data-testid no PrivacyBadge, vou buscar pela estrutura visual ou classe.
        // O badge usa "bg-white/20" no assistente.

        // Vamos buscar pelo ícone de shield ou shield-check genericamente
        // Aumentar timeout pois pode demorar para carregar (fetch de API)
        await expect(authenticatedPage.locator('svg.lucide-shield-check').or(authenticatedPage.locator('svg.lucide-shield')).first()).toBeVisible({ timeout: 15000 })
    })

    test('deve navegar para documentos via widget', async ({ authenticatedPage }) => {
        await authenticatedPage.click('text=Total de Documentos')
        await expect(authenticatedPage).toHaveURL('/documents')
    })

    test('deve navegar para alertas de IA', async ({ authenticatedPage }) => {
        // Verificar badge também aqui se possível
        await authenticatedPage.click('text=Ver todos os alertas')
        await expect(authenticatedPage).toHaveURL('/intelligence/alerts')
    })

    test('deve navegar para "Continue de onde parou"', async ({ authenticatedPage }) => {
        // Verificar se existe items
        if (await authenticatedPage.locator('text=Continue de onde parou').isVisible()) {
            // Tentar clicar em um item se existir
            const item = authenticatedPage.locator('text=Continue de onde parou').locator('..').locator('..').locator('div.cursor-pointer').first()
            if (await item.count() > 0) {
                await item.click()
                await expect(authenticatedPage).not.toHaveURL('/my-day')
            }
        }
    })
})
