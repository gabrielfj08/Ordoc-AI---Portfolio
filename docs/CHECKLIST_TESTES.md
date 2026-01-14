# ✅ CHECKLIST DE TESTES - CORREÇÕES IMPLEMENTADAS

**Objetivo:** Verificar que todas as correções funcionam corretamente.  
**Data:** 5 de janeiro de 2026  
**Status:** Pronto para teste

---

## 🧪 TESTES FUNCIONAIS

### 1️⃣ SCROLL INDEPENDENTE

**Cenário:** Garantir que cada painel tem scroll independente (não vaza um no outro)

```
TESTE: Scroll Grid Central
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │                  GRID CENTRAL                     │
│ (fixo)  │  (rolar aqui)                                     │
├─────────┼───────────────────────────────────────────────────┤
│         │                                                   │
│ Meu     │ Pasta A     Pasta B                               │
│ Drive   │ updated 1h  updated 2d                            │
│         │                                                   │
│ Recentes│ Doc 1       Doc 2                                 │
│ Favorito│                                                   │
│ Compil. │                                                   │
│         │                                                   │
└─────────┴───────────────────────────────────────────────────┘

PASSOS:
1. Abrir http://localhost:3000/documents
2. Rolar a grid central (main content area)
3. Observar a sidebar

VERIFICAÇÃO:
□ Sidebar fica completamente fixo (não se move)
□ Scroll bar só aparece na grid central
□ Padding e layout não mudam
```

---

```
TESTE: Scroll Painel Direito
┌───────────────────────────────────────────────┐
│ Sidebar │  GRID CENTRAL   │  Detalhes         │
│ (fixo)  │  (fixo aqui)    │  (rolar aqui)     │
├─────────┼─────────────────┼───────────────────┤
│         │                 │                   │
│ Meu     │ Doc selected    │ Detalhes:         │
│ Drive   │                 │ Nome: ...         │
│         │                 │ Tamanho: ...      │
│ Recentes│                 │ Criado: ...       │
│         │                 │ Modificado: ...   │
│         │                 │ Proprietário: ... │
│         │                 │                   │
└─────────┴─────────────────┴───────────────────┘

PASSOS:
1. Clicar em um documento na grid
2. Painel direito abre com detalhes
3. Rolar o painel direito (Detalhes)
4. Observar grid central

VERIFICAÇÃO:
□ Grid central fica completamente fixo
□ Scroll bar aparece só no painel direito
□ Sidebar também fica fixo
```

---

### 2️⃣ FETCHING EFICIENTE DE DIRETÓRIOS

**Cenário:** Verificar que diretórios só são buscados quando faz sentido

```
TESTE: Categorias que NÃO devem buscar diretórios

PASSOS:
1. Abrir DevTools (F12) → Guia Network
2. Limpar network (Ctrl+L)
3. Navegar para cada categoria abaixo
4. Verificar requests

CATEGORIA: Compartilhados
URL: http://localhost:3000/documents?category=compartilhados

VERIFICAÇÃO:
□ Requests esperados:
  ✓ documentsApi.list (docs)
  ✗ directoriesApi.list (NÃO DEVE APARECER)
□ Total de requests: 1
```

---

```
CATEGORIA: Lixeira
URL: http://localhost:3000/documents?category=lixeira

VERIFICAÇÃO:
□ Requests esperados:
  ✓ documentsApi.list (docs)
  ✗ directoriesApi.list (NÃO DEVE APARECER - não há dirs na lixeira)
□ Total de requests: 1
```

---

```
TESTE: Categorias que DEVEM buscar diretórios

CATEGORIA: Meu Drive
URL: http://localhost:3000/documents?category=meu-drive

VERIFICAÇÃO:
□ Requests esperados:
  ✓ documentsApi.list (docs)
  ✓ directoriesApi.list (dirs)
□ Total de requests: 2
□ Ambos os requests aparecem em paralelo (Promise.all)
```

---

### 3️⃣ URL PARAMS (COMPARTILHÁVEIS E PERSISTENTES)

**Cenário:** Verificar que estado está em URL, não em componente

```
TESTE: Navegação por URL
PASSOS:
1. Abrir /documents
2. URL inicial: http://localhost:3000/documents

VERIFICAÇÃO:
□ URL muda automaticamente quando clica em categorias:
  • Clica "Meu Drive"        → ?category=meu-drive
  • Clica "Favoritos"        → ?category=favoritos
  • Clica "Compartilhados"   → ?category=compartilhados
  • Clica "Lixeira"          → ?category=lixeira
```

---

```
TESTE: Filtros por Tipo
PASSOS:
1. Estar em categoria (ex: Meu Drive)
2. Clicar em um filtro de tipo (ex: "PDF")

VERIFICAÇÃO:
□ URL atualiza: ?category=meu-drive&type=pdf
□ Grid filtra para mostrar só PDFs
```

---

```
TESTE: Persistência no Refresh
PASSOS:
1. Navegar para: /documents?category=favoritos&type=pdf&page=2
2. Pressionar F5 (refresh)

VERIFICAÇÃO:
□ Página recarrega com:
  ✓ Categoria: Favoritos
  ✓ Filtro: PDF
  ✓ Página: 2 (não volta para página 1)
□ Nenhuma mudança visual
```

---

```
TESTE: Browser Back/Forward
PASSOS:
1. Visitar /documents?category=meu-drive
2. Visitar /documents?category=favoritos
3. Pressionar Back (←)

VERIFICAÇÃO:
□ Volta para: /documents?category=meu-drive
□ Grade mostra documentos de Meu Drive (não favoritos)
□ Pressionar Forward (→) volta para Favoritos
```

---

```
TESTE: URL Compartilhável
PASSOS:
1. Você: Navegar para /documents?category=favoritos&type=pdf
2. Você: Copiar URL
3. Compartilhar com colega
4. Colega: Colar URL e abrir em outro navegador

VERIFICAÇÃO:
□ Colega vê exatamente o mesmo:
  ✓ Categoria: Favoritos
  ✓ Filtro: PDF
  ✓ Mesma grid
```

---

### 4️⃣ CÓDIGO MORTO REMOVIDO

**Cenário:** Verificar que `selectedItemIds` foi removido

```
TESTE: Console Verification
PASSOS:
1. Abrir DevTools (F12)
2. Guia Console
3. Executar:

   console.log(documentsStore.getState())

VERIFICAÇÃO:
Verificar que o objeto retornado NÃO contém:
  ✗ selectedItemIds
  ✗ setSelection

Deve conter:
  ✓ selectedItemId (singular)
  ✓ selectedItemType
  ✓ setSelectedItem (singular)
```

---

```
TESTE: Arquivo Page.tsx não usa selectedItemIds
PASSOS:
1. Abrir arquivo: frontend/app/documents/page.tsx
2. Usar Ctrl+F para procurar: "selectedItemIds"

VERIFICAÇÃO:
□ Nenhum resultado encontrado
  (ou apenas em comentários de remoção)
```

---

## 🔍 TESTES DE REGRESSÃO

**Cenário:** Verificar que nada quebrou com as mudanças

### Funcionalidades que devem continuar funcionando:

```
□ Criar nova pasta
  PASSOS: Novo → Nova pasta
  VERIFICAÇÃO: Modal abre, pasta criada com sucesso

□ Upload de arquivo
  PASSOS: Novo → Upload de arquivo
  VERIFICAÇÃO: Modal abre, arquivo enviado

□ Renomear documento
  PASSOS: Menu ⋯ → Renomear
  VERIFICAÇÃO: Dialog abre, pode editar nome

□ Renomear pasta
  PASSOS: Clica com direito na pasta → Renomear
  VERIFICAÇÃO: Dialog abre, pode editar nome

□ Mover para lixeira
  PASSOS: Menu ⋯ → Mover para lixeira
  VERIFICAÇÃO: Item some da grid, aparece em Lixeira

□ Restaurar de lixeira
  PASSOS: Lixeira → Menu ⋯ → Restaurar
  VERIFICAÇÃO: Item volta para Meu Drive

□ Deletar permanentemente
  PASSOS: Lixeira → Menu ⋯ → Deletar permanentemente
  VERIFICAÇÃO: Modal pede confirmação, item deletado

□ Esvaziar lixeira
  PASSOS: Lixeira → Botão "Esvaziar Lixeira"
  VERIFICAÇÃO: Modal mostra stats, lixeira limpa

□ Drag & Drop (mover)
  PASSOS: Arrastar documento para pasta
  VERIFICAÇÃO: Documento movido, visual feedback durante drag

□ Vista Grid/List
  PASSOS: Clicar ícone Grid/List (canto superior)
  VERIFICAÇÃO: Alterna entre vista de grid e lista

□ Painel de Detalhes
  PASSOS: Clicar em documento
  VERIFICAÇÃO: Painel direito abre com detalhes
  OBS: Painel não fecha ao clicar outro doc (fica aberto)

□ Abas no Painel de Detalhes
  PASSOS: Selecionar documento → Clicar "Atividades"
  VERIFICAÇÃO: Mostra histórico de atividades
```

---

## 📊 RESUMO DO TESTE

| Teste | Status | Observações |
|-------|--------|------------|
| Scroll independente | ☐ OK / ☐ Falha | |
| Fetching eficiente | ☐ OK / ☐ Falha | |
| URL params | ☐ OK / ☐ Falha | |
| Browser back/forward | ☐ OK / ☐ Falha | |
| Código morto removido | ☐ OK / ☐ Falha | |
| Criar pasta | ☐ OK / ☐ Falha | |
| Upload arquivo | ☐ OK / ☐ Falha | |
| Renomear documento | ☐ OK / ☐ Falha | |
| Renomear pasta | ☐ OK / ☐ Falha | |
| Mover para lixeira | ☐ OK / ☐ Falha | |
| Restaurar de lixeira | ☐ OK / ☐ Falha | |
| Deletar permanentemente | ☐ OK / ☐ Falha | |
| Esvaziar lixeira | ☐ OK / ☐ Falha | |
| Drag & Drop | ☐ OK / ☐ Falha | |
| Vista Grid/List | ☐ OK / ☐ Falha | |
| Painel detalhes | ☐ OK / ☐ Falha | |
| Abas do painel | ☐ OK / ☐ Falha | |

---

## 🐛 SE ALGO QUEBROU

Se algum teste falhar:

1. **Anote qual teste falhou**
2. **Verifique o console (DevTools)**
3. **Procure por erros de rede (Network tab)**
4. **Crie uma issue no GitHub com:**
   - Qual teste falhou
   - Passos para reproduzir
   - Screenshot ou vídeo
   - Erro no console (se houver)

---

## ✨ PRÓXIMOS PASSOS APÓS TESTES

Se todos os testes passarem:

1. ✅ **Commit** as mudanças
   ```bash
   git add frontend/
   git commit -m "Fix: scroll independente, fetching eficiente, URL params, remove código morto"
   ```

2. ✅ **Push** para branch
   ```bash
   git push origin feature/fix-documents-module
   ```

3. ✅ **Criar PR** com documentação
   - Linkar este documento
   - Linkar CORREÇÕES_IMPLEMENTADAS.md
   - Pedir review do time

4. ✅ **Merge** após aprovação

5. ✅ **Deploy** para staging
   ```bash
   npm run build && npm run start
   ```

6. ✅ **Teste em staging** (testar em ambiente de produção antes)

7. ✅ **Deploy** para produção

8. ✅ **Monitor** em produção por 24h

---

**Boa sorte! 🚀**

