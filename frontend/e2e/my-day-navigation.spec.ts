import { test, expect } from './fixtures/auth'

test.describe('Meu Dia - Navegação', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navegar para a página Meu Dia antes de cada teste
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
  })

  test.describe('Cards de Métricas Principais', () => {
    test('deve navegar para /documents ao clicar em Total de Documentos', async ({ authenticatedPage }) => {
      await authenticatedPage.click('text=Total de Documentos')
      await expect(authenticatedPage).toHaveURL('/documents')
    })

    test('deve navegar para /settings/users ao clicar em Usuários Ativos', async ({ authenticatedPage }) => {
      await authenticatedPage.click('text=Usuários Ativos')
      await expect(authenticatedPage).toHaveURL('/settings/users')
    })

    test('deve navegar para /processes ao clicar em Processos Ativos', async ({ authenticatedPage }) => {
      await authenticatedPage.click('text=Processos Ativos')
      await expect(authenticatedPage).toHaveURL('/processes')
    })

    test('deve navegar para /processes ao clicar em Taxa de Aprovação', async ({ authenticatedPage }) => {
      await authenticatedPage.click('text=Taxa de Aprovação')
      await expect(authenticatedPage).toHaveURL('/processes')
    })
  })

  test.describe('Seção de Documentos Recentes', () => {
    test('deve navegar para /documents ao clicar em Ver todos', async ({ authenticatedPage }) => {
      const viewAllButton = authenticatedPage.locator('text=Documentos Recentes')
        .locator('..')
        .locator('text=Ver todos')
      
      await viewAllButton.click()
      await expect(authenticatedPage).toHaveURL('/documents')
    })

    test('deve navegar para documento específico ao clicar em documento da lista', async ({ authenticatedPage }) => {
      // Aguardar documentos carregarem
      const firstDoc = authenticatedPage.locator('[data-testid="document-item"]').first()
      
      // Verificar se existe pelo menos um documento
      const count = await authenticatedPage.locator('[data-testid="document-item"]').count()
      
      if (count > 0) {
        await firstDoc.click()
        // Verificar que navegou para página de documento (formato: /documents/{id})
        await expect(authenticatedPage).toHaveURL(/\/documents\/[a-f0-9-]+/)
      } else {
        test.skip()
      }
    })
  })

  test.describe('Seção de Workflows Ativos', () => {
    test('deve navegar para detalhes do workflow ao clicar no card', async ({ authenticatedPage }) => {
      // Aguardar workflows carregarem
      const firstWorkflow = authenticatedPage.locator('[data-testid="workflow-item"]').first()
      
      const count = await authenticatedPage.locator('[data-testid="workflow-item"]').count()
      
      if (count > 0) {
        await firstWorkflow.click()
        // Verificar que navegou para página de processo
        await expect(authenticatedPage).toHaveURL(/\/processes\/[a-f0-9-]+/)
      } else {
        test.skip()
      }
    })

    test('deve navegar ao clicar no botão Ver detalhes', async ({ authenticatedPage }) => {
      const viewDetailsButton = authenticatedPage.locator('text=Ver detalhes').first()
      
      const count = await authenticatedPage.locator('text=Ver detalhes').count()
      
      if (count > 0) {
        await viewDetailsButton.click()
        await expect(authenticatedPage).toHaveURL(/\/processes\/[a-f0-9-]+/)
      } else {
        test.skip()
      }
    })
  })

  test.describe('Widget de Tarefas Prioritárias', () => {
    test('deve navegar para /processes ao clicar em Ver todas as tarefas', async ({ authenticatedPage }) => {
      const viewAllTasksButton = authenticatedPage.locator('text=Ver todas as tarefas')
      
      await viewAllTasksButton.click()
      await expect(authenticatedPage).toHaveURL('/processes')
    })

    test('deve navegar para processo ao clicar em tarefa individual', async ({ authenticatedPage }) => {
      const firstTask = authenticatedPage.locator('[data-testid="priority-task-item"]').first()
      
      const count = await authenticatedPage.locator('[data-testid="priority-task-item"]').count()
      
      if (count > 0) {
        await firstTask.click()
        await expect(authenticatedPage).toHaveURL(/\/processes\/[a-f0-9-]+/)
      } else {
        test.skip()
      }
    })
  })

  test.describe('Widget de Alertas de IA', () => {
    test('deve navegar para /intelligence/alerts ao clicar em Ver todos os alertas', async ({ authenticatedPage }) => {
      const viewAllAlertsButton = authenticatedPage.locator('text=Ver todos os alertas')
      
      await viewAllAlertsButton.click()
      await expect(authenticatedPage).toHaveURL('/intelligence/alerts')
    })
  })

  test.describe('Card do Assistente Ordoc', () => {
    test('deve navegar para /documents com query param ao clicar em Fazer upload', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.locator('text=Fazer upload de documento')
      
      await uploadButton.click()
      await expect(authenticatedPage).toHaveURL('/documents?action=upload')
    })

    test('deve navegar para /processes com query param ao clicar em Criar novo processo', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.locator('text=Criar novo processo')
      
      await createButton.click()
      await expect(authenticatedPage).toHaveURL('/processes?action=create')
    })
  })

  test.describe('Botão Flutuante', () => {
    test('deve navegar para /documents?action=upload ao clicar no botão +', async ({ authenticatedPage }) => {
      const floatingButton = authenticatedPage.locator('button.fixed.bottom-8.right-8')
      
      await floatingButton.click()
      await expect(authenticatedPage).toHaveURL('/documents?action=upload')
    })
  })

  test.describe('Query Params Validation', () => {
    test('deve manter query params corretos ao navegar', async ({ authenticatedPage }) => {
      const uploadButton = authenticatedPage.locator('text=Fazer upload de documento')
      await uploadButton.click()
      
      // Verificar que o query param está presente
      const url = authenticatedPage.url()
      expect(url).toContain('action=upload')
    })

    test('deve ter query param correto para criar processo', async ({ authenticatedPage }) => {
      const createButton = authenticatedPage.locator('text=Criar novo processo')
      await createButton.click()
      
      const url = authenticatedPage.url()
      expect(url).toContain('action=create')
    })
  })
})
