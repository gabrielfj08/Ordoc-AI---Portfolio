# Frontend New — Casos de Uso (Use Cases)

Diagrama de casos de uso (alto nível), inspirado nos exemplos.

```mermaid
flowchart LR
  %% Atores
  User((Usuário Interno))
  Admin((Admin/Manager))
  Ext((Solicitante Externo))

  %% Sistema
  subgraph SYS[Frontend Ordoc (frontend-new)]
    UC1([Autenticar])
    UC2([Ver Meu Dia / Dashboard])
    UC3([Gerenciar Documentos])
    UC31([Upload de Documento])
    UC32([Buscar/Filtrar])
    UC33([Download/Preview])
    UC34([Favoritar/Arquivar])

    UC4([Gerenciar Processos])
    UC41([Ver Kanban de Tarefas])
    UC42([Mover status de tarefa])
    UC43([Criar procedimento])

    UC5([Assinaturas])
    UC51([Gerenciar Certificados])
    UC52([Criar Solicitação de Assinatura])
    UC53([Validar Assinatura])
    UC54([Ver Logs/Auditoria])

    UC6([Notificações])
    UC61([Receber notificações em tempo real])
    UC62([Marcar como lida])

    UC7([Alertas de IA])
    UC71([Visualizar alertas])
    UC72([Responder alerta])

    UC8([Administração de Organização])
    UC81([Gerenciar organização])
    UC82([Gerenciar usuários/roles])
  end

  %% Relações atores -> casos
  User --> UC1
  User --> UC2
  User --> UC3
  User --> UC4
  User --> UC5
  User --> UC6
  User --> UC7

  Admin --> UC8

  %% includes/extends (equivalentes)
  UC3 --> UC31
  UC3 --> UC32
  UC3 --> UC33
  UC3 --> UC34

  UC4 --> UC41
  UC4 --> UC42
  UC4 --> UC43

  UC5 --> UC51
  UC5 --> UC52
  UC5 --> UC53
  UC5 --> UC54

  UC6 --> UC61
  UC6 --> UC62

  UC7 --> UC71
  UC7 --> UC72
```

## Observações

- Os casos estão distribuídos pelas rotas do `app/` e pelos componentes/widgets.
- O frontend usa `services/*-api.ts` como contrato de integração com o backend.
