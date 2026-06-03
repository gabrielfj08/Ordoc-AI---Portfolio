# 📝 Estratégia de Conteúdo e Marketing Pessoal (Ordoc AI)

Este documento foi criado para ajudar você, Gabriel, a transformar o conhecimento técnico aplicado no desenvolvimento do **Ordoc AI** em posts de alto engajamento no LinkedIn e artigos aprofundados para um blog técnico pessoal.

---

## 🎯 Objetivo
Demonstrar autoridade técnica, capacidade de tomada de decisões arquiteturais, preocupação com boas práticas e atrair atenção de recrutadores, líderes técnicos (Tech Leads) e outros profissionais da área de desenvolvimento.

---

## 💼 LinkedIn Content Pack (Postagens Rápidas e Visuais)

Posts no LinkedIn funcionam muito bem quando combinam **uma dor de desenvolvimento**, **a solução adotada** e **um aprendizado (ou imagem/código curto)**.

### Post 1: Estado Global (Zustand) vs Context API
*   **Tema:** Decisão arquitetural de gerenciamento de estado.
*   **Gancho/Título:** "Por que parei de usar React Context para tudo e adotei o Zustand no Ordoc AI."
*   **Conteúdo do Post:**
    *   Explicar brevemente o problema de re-renderizações desnecessárias ao usar Context API em dashboards dinâmicos (como o "My Day").
    *   Apresentar o Zustand como uma solução ultra-leve, sem boilerplate e extremamente rápida.
    *   Mostrar um pequeno trecho de código criando um store simples (ex: store de documentos).
    *   **Call to Action (CTA):** "Como você gerencia o estado global nas suas aplicações React hoje? Prefere Redux, Zustand ou se mantém no Context?"
*   **Mídia recomendada:** Uma imagem limpa de um trecho de código de um store do Zustand ou um print das estatísticas de renderização.

### Post 2: Formulários Resilientes e Performance (React Hook Form + Zod)
*   **Tema:** Experiência do usuário (UX) e validação.
*   **Gancho/Título:** "Formulários complexos não precisam ser sinônimo de lentidão ou código confuso."
*   **Conteúdo do Post:**
    *   Falar sobre o desafio de validar múltiplos campos em tempo real (uploads de documentos, campos dinâmicos).
    *   Apresentar a dobradinha `react-hook-form` + `zod` resolver.
    *   Destacar os benefícios: validação declarativa através do Schema do Zod e performance excelente (RHF não re-renderiza o formulário inteiro a cada tecla digitada).
    *   **CTA:** "Você costuma validar seus formulários no frontend apenas com Zod ou utiliza alguma outra ferramenta de validação de schemas?"
*   **Mídia recomendada:** Print do modal de upload ou de formulário com erros tratados de forma limpa.

### Post 3: A Cultura de Testes no Frontend (Cypress + Jest)
*   **Tema:** Qualidade de Software e Confiabilidade.
*   **Gancho/Título:** "Não teste em produção! Como Jest e Cypress garantem o sono do time de desenvolvimento."
*   **Conteúdo do Post:**
    *   Mencionar que o Ordoc AI possui uma suíte de testes robusta.
    *   Explicar a divisão de responsabilidades: Jest para testes unitários rápidos de funções e componentes puros + Cypress para simular fluxos completos do usuário (End-to-End).
    *   Destacar como isso acelera o processo de code-review e evita que deploys quebrem funcionalidades antigas.
    *   **CTA:** "A sua equipe atual prioriza testes unitários ou foca mais em testes de integração/E2E?"
*   **Mídia recomendada:** Um gif curto ou print do Cypress rodando os testes E2E com sucesso na tela.

---

## ✍️ Roteiros para Blog Pessoal (Conteúdos Aprofundados)

Artigos de blog servem para mostrar que você entende o "porquê" das coisas, explicando de forma detalhada o passo a passo.

### Artigo 1: "Guia Definitivo: Upload de Arquivos Drag-and-Drop com Progresso em Tempo Real no Next.js 14+"
*   **O que abordar:**
    *   Como construir um modal de upload drag-and-drop acessível e amigável.
    *   Utilização de hooks do React para gerenciar o estado do arrastar (dragover, drop).
    *   Como calcular a porcentagem de upload usando Axios (`onUploadProgress`) e refletir isso em um componente de progresso visual (Shadcn/UI).
    *   Boas práticas de segurança (limitação de tipo de arquivo e tamanho no client-side antes de enviar ao server).

### Artigo 2: "Construindo Interfaces Altamente Acessíveis (a11y) usando Radix UI e Tailwind CSS"
*   **O que abordar:**
    *   A importância da acessibilidade na web moderna (por que não devemos fazer botões usando apenas `div`s).
    *   Como o Shadcn UI/Radix ajuda a obter navegação por teclado e suporte a leitores de tela automaticamente.
    *   Exemplos de refatorações de modais ou dropdowns comuns no projeto que se tornaram acessíveis.
    *   Como utilizar ferramentas de teste de acessibilidade automatizadas como o `jest-axe` que está configurado no projeto.

---

## 📅 Sugestão de Calendário de Divulgação (4 semanas)

| Semana | Canal | Tipo de Conteúdo | Tema |
| :--- | :--- | :--- | :--- |
| **Semana 1** | LinkedIn | Post Texto + Imagem | **Lançamento do Portfólio:** Apresentação geral do Ordoc AI, link do repositório e tecnologias utilizadas. |
| **Semana 2** | LinkedIn | Post Técnico / Carrossel | **Zustand vs Context API:** Foco em decisões técnicas de performance de renderização. |
| **Semana 3** | Blog / Medium | Artigo Completo | **Upload Resiliente:** Tutorial técnico ensinando a criar a barra de progresso de upload que você fez. |
| **Semana 4** | LinkedIn | Post de Engenharia | **Qualidade com Testes:** Demonstrando a suite do Cypress no frontend e o impacto disso na segurança de deploy. |
