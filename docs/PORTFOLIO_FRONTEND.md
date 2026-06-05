# 🩺 Ordoc AI — Frontend Dashboard

> **Ordoc AI** é uma plataforma inteligente voltada para a gestão de processos, análise de dados e fluxos de documentos e rotinas corporativas. Este repositório contém a aplicação **Frontend** construída sob uma arquitetura moderna, escalável e focada na melhor experiência de uso (UX) e performance.

Este projeto serve como um showcase técnico pessoal, demonstrando a aplicação prática de padrões modernos de desenvolvimento Web e engenharia de software com **React 19** e **Next.js 14+**.

---

## 🚀 Stack Tecnológica & Decisões de Arquitetura

O projeto foi projetado utilizando o estado da arte do ecossistema React/Next.js:

*   **Framework Principal:** [Next.js 16 (App Router)](https://nextjs.org/) para roteamento otimizado baseado em arquivos, renderização híbrida (SSR/Client-side) e otimização automática de recursos (imagens, fontes).
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/) garantindo tipagem estática forte, maior segurança em tempo de desenvolvimento e facilidade na manutenção do código.
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/) combinado com [CSS Variables](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Using_CSS_custom_properties) para um design system flexível, responsivo e de rápido desenvolvimento.
*   **Biblioteca de Componentes:** [Shadcn/UI](https://ui.shadcn.com/) (construído sob os primitivos de acessibilidade do [Radix UI](https://www.radix-ui.com/)) garantindo conformidade com padrões **WAI-ARIA** e flexibilidade total de customização.
*   **Gerenciamento de Estado Global:** [Zustand](https://zustand-demo.pmnd.rs/) para um gerenciamento de estado minimalista, rápido e sem a complexidade (e re-renderizações desnecessárias) do Redux ou da Context API em dashboards complexos.
*   **Sincronização de Dados & Cache:** [React Query (TanStack Query v5)](https://tanstack.com/query/latest) para controle refinado de requisições HTTP, cache inteligente em memória, refetching em background e gerenciamento de estados de loading/error de forma declarativa.
*   **Validação & Formulários:** [React Hook Form](https://react-hook-form.com/) integrado com [Zod](https://zod.dev/) para esquemas de validação robustos diretamente no client-side com feedback instantâneo de UX.
*   **Animações:** [Framer Motion](https://www.framer.com/motion/) para micro-interações fluidas e transições de página elegantes, elevando a percepção de qualidade do produto.
*   **Qualidade e Testes:**
    *   **Testes Unitários e de Componente:** [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) + [Jest-Axe](https://github.com/nickcolley/jest-axe) (testes de acessibilidade automatizados).
    *   **Testes de Integração & E2E:** [Cypress](https://www.cypress.io/) para garantir que os fluxos críticos de negócio funcionem de ponta a ponta.

---

## 📂 Organização do Projeto (`src/`)

A estrutura de pastas foi organizada para maximizar a reutilização de componentes e a separação de responsabilidades (Separation of Concerns):

```text
src/
├── api/             # Definição de mappers, DTOs e funções auxiliares de comunicação de API.
├── app/             # Estrutura do Next.js App Router (Layouts, Páginas e Roteamento).
│   ├── (dashboard)  # Grupo de rotas autenticadas (analytics, documents, signature, processes).
│   ├── guest        # Rotas públicas/visitantes.
│   └── login        # Fluxo de autenticação.
├── components/      # Componentes React organizados por domínios de negócio:
│   ├── analytics/   # Componentes de gráficos e relatórios (usando Recharts).
│   ├── documents/   # Grid, upload e visualização de documentos.
│   ├── my-day/      # O Dashboard diário consolidado do usuário (State & Cards).
│   ├── shared/      # Modais de upload unificados, inputs genéricos e helpers de UI.
│   └── ui/          # Componentes base e primitivos de design (Shadcn/UI).
├── hooks/           # Custom Hooks para compartilhamento de lógica (especialmente React Query queries/mutations).
├── services/        # Abstração de chamadas HTTP (Axios) isolando a lógica de negócio do transporte de dados.
└── types/           # Tipagens TypeScript compartilhadas em toda a aplicação.
```

---

## 🛠️ Funcionalidades em Destaque no Frontend

1.  **Dashboard Dinâmico (My Day):** Centralização de tarefas diárias, estatísticas em tempo real e atalhos rápidos com estados reativos gerenciados via Zustand.
2.  **Visualizador & Assinatura de Documentos:** Interface fluida para leitura de PDFs e fluxo de coleta de assinaturas digitais com animações dinâmicas de progresso.
3.  **Upload Unificado e Drag-and-Drop:** Modal inteligente configurado para validação de formatos, progresso de upload visual e tratamento resiliente de falhas de conexão.
4.  **Acessibilidade Nativa (a11y):** Componentes interativos testados com leitores de tela e navegação por teclado fluida graças aos componentes Radix UI.

---

## 💻 Instalação e Execução Local

### Pré-requisitos
Certifique-se de ter instalado:
*   [Node.js](https://nodejs.org/) (versão LTS recomendada)
*   [pnpm](https://pnpm.io/) (utilizado para gerenciamento rápido de pacotes neste projeto)

### Passos
1.  **Clone o repositório:**
    ```bash
    git clone git@github.com:gabrielfj08/Ordoc-AI---Portfolio.git
    cd Ordoc-AI---Portfolio
    ```
2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```
3.  **Configuração de Ambiente:**
    Crie um arquivo `.env.local` na raiz com base nas variáveis necessárias (ex: URL da API backend):
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    pnpm run dev
    ```
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🧪 Rodando os Testes

O projeto conta com uma suíte de testes robusta para garantir a estabilidade do código diante de refatorações:

*   **Testes Unitários & Componentes (Jest):**
    ```bash
    pnpm test
    ```
*   **Testes E2E com Cypress (Interface Visual):**
    ```bash
    pnpm test:e2e
    ```
*   **Testes E2E em modo Headless (CI/CD):**
    ```bash
    pnpm test:e2e:headless
    ```
