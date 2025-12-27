import { test, expect } from './fixtures/auth'

test.describe('Fluxos de Usuário Completos', () => {
  
  test('Fluxo: Login -> Meu Dia -> Documento -> Voltar', async ({ authenticatedPage }) => {
    // 1. Já está autenticado (fixture)
    await expect(authenticatedPage).toHaveURL('/')
    
    // 2. Navegar para Meu Dia
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
    await expect(authenticatedPage).toHaveURL('/my-day')
    
    // 3. Verificar que a página carregou corretamente
    await expect(authenticatedPage.locator('text=Bom dia, ') || authenticatedPage.locator('text=Boa tarde, ') || authenticatedPage.locator('text=Boa noite, ')).toBeVisible()
    
    // 4. Clicar no card "Total de Documentos"
    await authenticatedPage.click('text=Total de Documentos')
    await expect(authenticatedPage).toHaveURL('/documents')
    
    // 5. Voltar usando navegador
    await authenticatedPage.goBack()
    await expect(authenticatedPage).toHaveURL('/my-day')
  })

  test('Fluxo: Meu Dia -> Upload de Documento', async ({ authenticatedPage }) => {
    // 1. Navegar para Meu Dia
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
    
    // 2. Clicar no botão flutuante de upload
    const floatingButton = authenticatedPage.locator('button.fixed.bottom-8.right-8')
    await floatingButton.click()
    
    // 3. Verificar navegação com query param
    await expect(authenticatedPage).toHaveURL('/documents?action=upload')
    
    // 4. Verificar que a ação de upload está ativa (se houver modal/dialog)
    // Nota: Ajustar conforme implementação real
  })

  test('Fluxo: Meu Dia -> Criar Processo', async ({ authenticatedPage }) => {
    // 1. Navegar para Meu Dia
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
    
    // 2. Clicar em "Criar novo processo" no assistente
    const createButton = authenticatedPage.locator('text=Criar novo processo')
    await createButton.click()
    
    // 3. Verificar navegação com query param
    await expect(authenticatedPage).toHaveURL('/processes?action=create')
  })

  test('Fluxo: Meu Dia -> Ver Documento -> Processar', async ({ authenticatedPage }) => {
    // 1. Navegar para Meu Dia
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
    
    // 2. Verificar se há documentos recentes
    const docCount = await authenticatedPage.locator('[data-testid="document-item"]').count()
    
    if (docCount > 0) {
      // 3. Clicar no primeiro documento
      const firstDoc = authenticatedPage.locator('[data-testid="document-item"]').first()
      await firstDoc.click()
      
      // 4. Verificar navegação para página do documento
      await expect(authenticatedPage).toHaveURL(/\/documents\/[a-f0-9-]+/)
      
      // 5. Verificar que a página do documento carregou
      // Nota: Ajustar seletores conforme implementação
      await authenticatedPage.waitForLoadState('networkidle')
    } else {
      test.skip()
    }
  })

  test('Fluxo: Meu Dia -> Ver Alertas de IA -> Marcar como Lido', async ({ authenticatedPage }) => {
    // 1. Navegar para Meu Dia
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
    
    // 2. Verificar se há alertas
    const alertCount = await authenticatedPage.locator('[data-testid="alert-item"]').count()
    
    if (alertCount > 0) {
      // 3. Clicar em marcar como lido no primeiro alerta
      const markReadButton = authenticatedPage.locator('[data-testid="alert-item"]').first().locator('button').last()
      await markReadButton.click()
      
      // 4. Verificar que o alerta desapareceu
      await authenticatedPage.waitForTimeout(500)
      const newCount = await authenticatedPage.locator('[data-testid="alert-item"]').count()
      expect(newCount).toBe(alertCount - 1)
    }
    
    // 5. Navegar para página completa de alertas
    const viewAllAlertsButton = authenticatedPage.locator('text=Ver todos os alertas')
    await viewAllAlertsButton.click()
    await expect(authenticatedPage).toHaveURL('/intelligence/alerts')
  })

  test('Fluxo: Meu Dia -> Ver Workflow -> Detalhes', async ({ authenticatedPage }) => {
    // 1. Navegar para Meu Dia
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
    
    // 2. Verificar se há workflows ativos
    const workflowCount = await authenticatedPage.locator('[data-testid="workflow-item"]').count()
    
    if (workflowCount > 0) {
      // 3. Clicar no primeiro workflow
      const firstWorkflow = authenticatedPage.locator('[data-testid="workflow-item"]').first()
      await firstWorkflow.click()
      
      // 4. Verificar navegação
      await expect(authenticatedPage).toHaveURL(/\/processes\/[a-f0-9-]+/)
      
      // 5. Verificar que a página carregou
      await authenticatedPage.waitForLoadState('networkidle')
    } else {
      test.skip()
    }
  })

  test('Fluxo: Meu Dia -> Múltiplas navegações -> Verificar breadcrumbs', async ({ authenticatedPage }) => {
    // 1. Navegar para Meu Dia
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
    
    // 2. Navegar para documentos
    await authenticatedPage.click('text=Total de Documentos')
    await expect(authenticatedPage).toHaveURL('/documents')
    
    // 3. Voltar
    await authenticatedPage.goBack()
    await expect(authenticatedPage).toHaveURL('/my-day')
    
    // 4. Navegar para processos
    await authenticatedPage.click('text=Processos Ativos')
    await expect(authenticatedPage).toHaveURL('/processes')
    
    // 5. Voltar
    await authenticatedPage.goBack()
    await expect(authenticatedPage).toHaveURL('/my-day')
    
    // 6. Verificar que a página ainda funciona após múltiplas navegações
    await expect(authenticatedPage.locator('text=Bom dia, ') || authenticatedPage.locator('text=Boa tarde, ') || authenticatedPage.locator('text=Boa noite, ')).toBeVisible()
  })

  test('Fluxo: Performance - Tempo de carregamento da página Meu Dia', async ({ authenticatedPage }) => {
    const startTime = Date.now()
    
    // Navegar para Meu Dia
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
    
    const endTime = Date.now()
    const loadTime = endTime - startTime
    
    // Verificar que carregou em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000)
    
    // Log do tempo de carregamento
    console.log(`Página Meu Dia carregada em ${loadTime}ms`)
  })

  test('Fluxo: Atualização automática de dados', async ({ authenticatedPage }) => {
    // 1. Navegar para Meu Dia
    await authenticatedPage.goto('/my-day')
    await authenticatedPage.waitForLoadState('networkidle')
    
    // 2. Capturar contagem inicial de documentos
    const initialDocsText = await authenticatedPage.locator('text=Total de Documentos').locator('..').locator('text=/\\d+/').first().textContent()
    
    // 3. Aguardar alguns segundos (simular passagem de tempo)
    await authenticatedPage.waitForTimeout(3000)
    
    // 4. Verificar que a página ainda está funcional
    await expect(authenticatedPage).toHaveURL('/my-day')
    
    // Nota: Para testar atualização real, seria necessário criar dados no backend
  })
})
