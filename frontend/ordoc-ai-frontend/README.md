# Ordoc-AI Frontend

Este diretório contém a aplicação web desenvolvida em **Next.js 15**.

## Requisitos

- **Node.js 18+**
- Gerenciador de pacotes `npm` (ou `yarn`/`pnpm`)

Instale as dependências executando:

```bash
npm install
```

## Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e ajuste os valores conforme o ambiente (desenvolvimento ou produção). O principal parâmetro é `NEXT_PUBLIC_API_URL`, que define o endereço base da API utilizada pelo frontend.

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## Build de Produção

Gere os arquivos otimizados com:

```bash
npm run build
```

Depois execute a versão compilada:

```bash
npm start
```

## Testes e Lint

Ainda não há uma suíte de testes automatizados. Utilize o lint para verificar o código:

```bash
npm run lint
```

## Módulos Migrados

De acordo com o relatório de migração, já existem partes do frontend para:

- **Autenticação e OrdocFlow** (95% concluído)
- **OrdocCloud** (80% concluído) – gestão de organizações, usuários e políticas
- **OrdocAir** (60% concluído)
- **OrdocReports** (iniciado, ~20% concluído)

O módulo **OrdocSign** ainda não foi migrado.
