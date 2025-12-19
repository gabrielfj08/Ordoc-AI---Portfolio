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

Copie o arquivo `.env.example` para `.env` e ajuste os valores conforme o ambiente (desenvolvimento ou produção). Os parâmetros mais comuns são:

- `NEXT_PUBLIC_API_URL`: endereço base da API utilizada pelo frontend. Padrão `http://localhost:8000`.
- `NEXT_PUBLIC_DEFAULT_SUBDOMAIN`: subdomínio exibido quando a URL não define uma organização. Padrão `demo`.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: chave pública do Cloudflare Turnstile para validação de formulários. Padrão `1x00000000000000000000AA`.

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

O módulo **OrdocSign** está em migração (cerca de 20% concluído).
A página `src/app/dashboard/ordoc-sign` já lista as assinaturas pendentes do
usuário e permite acessar a tela de assinatura.

## Assinatura de Documentos

1. Acesse o dashboard e clique em **OrdocSign**.
2. Use o botão **Gerenciar Certificados / Manage Certificates** para enviar um certificado digital (tipos A1 ou A3) e defini-lo como padrão.
3. Retorne à lista e selecione **Assinar / Sign** ao lado do documento desejado.
4. Escolha o certificado, informe os dados da assinatura e confirme. Um indicador de carregamento aparecerá durante o processo.

Todos os botões e campos podem ser navegados via teclado e possuem rótulos em português e inglês para facilitar o uso.
