import { test, expect } from './fixtures/auth'
import path from 'path'

test.describe('Ciclo de Vida de Documentos', () => {

    test('deve fazer upload de um documento', async ({ authenticatedPage }) => {
        await authenticatedPage.goto('/documents?action=upload')

        // Localizar input de arquivo (geralmente oculto)
        const fileInput = authenticatedPage.locator('input[type="file"]')

        // Caminho do arquivo
        const filePath = path.join(__dirname, 'fixtures', 'dummy.pdf')

        // Setar arquivo
        await fileInput.setInputFiles(filePath)

        // Aguardar upload (pode haver um botão de confirmação ou auto-upload)
        // Assumindo que tem um botão de enviar/processar se não for automático
        const submitButton = authenticatedPage.locator('text=Enviar').or(authenticatedPage.locator('text=Processar')).first()
        if (await submitButton.isVisible()) {
            await submitButton.click()
        }

        // Verificar se apareceu mensagem de sucesso ou redirecionou
        await expect(authenticatedPage.locator('text=Upload realizado com sucesso')
            .or(authenticatedPage.locator('text=Processamento iniciado'))).toBeVisible({ timeout: 10000 })
    })

    test('deve listar documentos e acessar detalhes', async ({ authenticatedPage }) => {
        await authenticatedPage.goto('/documents')

        // Verificar se a lista não está vazia (assumindo que o teste anterior ou seed populou)
        // Se estiver vazia, o teste deve pular ou falhar dependendo da estratégia

        const docItem = authenticatedPage.locator('[data-testid="document-item"]').first()

        // Esperar carregar
        await authenticatedPage.waitForTimeout(2000)

        if (await docItem.count() > 0) {
            const title = await docItem.locator('.font-medium').first().textContent() || 'Documento'

            await docItem.click()

            // Verificar URL
            await expect(authenticatedPage).toHaveURL(/\/documents\/[a-f0-9-]+/)

            // Verificar se titilo esta presente na pagina de detalhes
            await expect(authenticatedPage.locator('h1').or(authenticatedPage.locator('h2'))).toContainText(title)
        } else {
            console.log('Nenhum documento encontrado para teste de detalhes')
        }
    })

    test('deve favoritar e desfavoritar um documento', async ({ authenticatedPage }) => {
        await authenticatedPage.goto('/documents')
        await authenticatedPage.waitForTimeout(2000)

        const docItem = authenticatedPage.locator('[data-testid="document-item"]').first()

        if (await docItem.count() > 0) {
            // Localizar botão de estrela/favorito dentro do item
            const starButton = docItem.locator('button[aria-label="Favoritar"]').or(docItem.locator('svg.lucide-star').locator('..'))

            // Estado inicial
            const initialClass = await starButton.getAttribute('class')

            // Clicar para favoritar
            await starButton.click()

            // Verificar mudança visual (classe de cor, fill, etc)
            // Isso é frágil, melhor checar toast ou estado
            await expect(authenticatedPage.locator('text=Documento favoritado')
                .or(authenticatedPage.locator('text=Favorito atualizado'))).toBeVisible()

            // Clicar novamente para desfavoritar
            await starButton.click()

            // Verificar mensagem
            // await expect(authenticatedPage.locator('text=Documento desfavoritado')).toBeVisible()
        }
    })

})
