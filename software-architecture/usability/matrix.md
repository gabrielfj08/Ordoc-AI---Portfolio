# Usabilidade — Matriz: ator × módulos do produto

A matriz abaixo resume **quem usa o quê** e qual é a criticidade de usabilidade por setor.

Legenda:
- **Primário**: uso diário / fluxo crítico.
- **Secundário**: usa eventualmente.
- **Baixo**: raramente.

## Empresa / Consultoria

| Ator | Meu Dia | Documentos | Processos | Assinaturas | Notificações | Análises/Relatórios |
|---|---|---|---|---|---|---|
| Admin/Owner | Primário (priorização) | Primário (governança) | Secundário | Primário (aprovação/assinatura) | Primário | Secundário |
| Analista/Operação | Primário (tarefas) | Primário (upload/organização) | Primário (execução) | Secundário | Primário | Baixo |
| Revisor/Jurídico | Secundário | Primário (revisão) | Secundário | Secundário | Secundário | Baixo |
| Aprovador/Signer | Secundário | Secundário | Secundário | Primário | Secundário | Baixo |

## Escritório de advocacia

| Ator | Meu Dia | Documentos | Processos | Assinaturas | Notificações | Análises/Relatórios |
|---|---|---|---|---|---|---|
| Sócio (ADMIN) | Primário (escalonamento) | Secundário | Secundário | Primário (certificados/assinatura) | Primário (alertas) | Secundário |
| Advogado (LAWYER) | Primário (prazos) | Primário (minutas/provas) | Primário (tarefas/casos) | Secundário | Primário | Baixo |
| Estagiário (INTERN) | Secundário | Primário (organização) | Secundário | Baixo | Secundário | Baixo |
| Administrativo (STAFF) | Baixo | Secundário | Secundário | Baixo | Secundário | Secundário |

## Órgão público

| Ator | Meu Dia | Documentos | Processos | Assinaturas | Notificações | Análises/Relatórios |
|---|---|---|---|---|---|---|
| TI / Gestor do sistema | Secundário | Secundário | Secundário | Secundário | Secundário | Primário (auditoria/gestão) |
| Analista/Pregoeiro | Primário | Primário | Primário (kanban/etapas) | Secundário | Primário | Secundário |
| Diretor/Chefia | Primário (aprovações) | Secundário | Primário (aprovar/tramitar) | Secundário | Primário | Secundário |
| Jurídico | Primário (fila de parecer) | Primário (revisão) | Primário (etapas) | Secundário | Primário | Secundário |
| Secretário/Autoridade | Secundário | Secundário | Secundário | Primário (assinatura final) | Primário | Secundário |
| Cidadão/Fornecedor (externo) | Baixo | Baixo | Primário (acompanhar) | Baixo | Secundário | Baixo |

## Observações de UX (transversais)

- O **"Meu Dia"** muda de natureza por setor:
  - Empresa: central de produtividade + IA.
  - Advocacia: central de risco (prazos/intimações).
  - Governo: central de tramitação/aprovação.

- **Assinaturas** são sempre fluxo crítico para autoridades/aprovadores; para operadores é mais secundário.
- **Notificações** precisam ser priorizadas (evitar ruído), porque são “gatilho” de ação em todos os setores.
