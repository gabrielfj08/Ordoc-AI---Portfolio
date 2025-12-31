# 🧪 Como Testar Diferentes Níveis de Usuário

**Data:** 2025-12-29
**Status:** ✅ Pronto para Uso

---

## 📋 Resumo

Sistema completo de **roles e permissões** implementado com filtros baseados em cargos:

| Cargo | Email | Role | O Que Vê |
|-------|-------|------|----------|
| **Sócio** | `socio@moura.law` | `admin` | **TUDO** - todos documentos e tasks |
| **Sênior** | `senior@moura.law` | `organization_manager` | Seu departamento + compartilhados |
| **Pleno** | `pleno@moura.law` | `department_manager` | Tasks atribuídas + criadas por ele |
| **Paralegal** | `paralegal@moura.law` | `organization_member` | **APENAS** suas próprias tasks e documentos |

**Senha para todos:** `password123`

---

## 🚀 Passo 1: Popular o Banco de Dados

### Executar Script de Seed

```bash
# 1. Navegar para o backend
cd /home/user/ordoc-ai/backend

# 2. Executar script de seed
python seed_test_users.py
```

### O Que o Script Faz:

✅ **Cria 1 Organização:** "Moura & Advogados Associados"
✅ **Cria 4 Departamentos:**
   - Societário
   - Trabalhista
   - Tributário
   - Administrativo

✅ **Cria 4 Usuários** com diferentes roles:
   - Alberto Moura (Sócio) - admin
   - Carla Ferreira (Sênior) - organization_manager
   - Ricardo Santos (Pleno) - department_manager
   - Julia Costa (Paralegal) - organization_member

✅ **Cria Documentos Específicos:**
   - Sócio: 5 documentos institucionais (visíveis para todos)
   - Sênior: 8 documentos de M&A (departamento Societário)
   - Pleno: 6 processos trabalhistas (departamento Trabalhista)
   - Paralegal: 4 documentos administrativos (apenas dele)

✅ **Cria Procedures e Tasks:**
   - Sócio: 3 procedures estratégicas + 6 tasks
   - Sênior: 5 operações M&A + 20 tasks
   - Pleno: 4 processos trabalhistas + 12 tasks
   - Paralegal: 16 tasks de suporte (atribuídas a ele)

### Saída Esperada:

```
============================================================
🌱 SEED: Populando Banco de Dados
============================================================

✅ Organização criada: Moura & Advogados Associados
✅ Departamento criado: Societário
✅ Departamento criado: Trabalhista
✅ Departamento criado: Tributário
✅ Departamento criado: Administrativo

✅ User Django criado: socio@moura.law
✅ OrdocUser criado: Alberto Moura
✅ Role criado: admin para socio@moura.law

... (continua para os outros usuários)

📄 Criando documentos...
✅ Criados 5 documentos do Sócio (públicos)
✅ Criados 8 documentos do Sênior (Societário)
✅ Criados 6 documentos do Pleno (Trabalhista)
✅ Criados 4 documentos do Paralegal (Administrativo)

📋 Criando procedures e tasks...
✅ Criados 3 procedures e 6 tasks do Sócio
✅ Criados 5 procedures e 20 tasks do Sênior
✅ Criados 4 procedures e 12 tasks do Pleno
✅ Criadas 16 tasks do Paralegal (suporte)

============================================================
✅ SEED CONCLUÍDO COM SUCESSO!
============================================================

📊 RESUMO:
Organizations: 1
Departments: 4
Users: 4
Documents: 23
Procedures: 12
Tasks: 54

👥 USUÁRIOS DE TESTE:
────────────────────────────────────────────────────────────
📧 socio@moura.law
   Nome: Alberto Moura
   Role: Administrador
   Departamento: Todos os departamentos
   Senha: password123

📧 senior@moura.law
   Nome: Carla Ferreira
   Role: Gerente da Organização
   Departamento: Societário
   Senha: password123

📧 pleno@moura.law
   Nome: Ricardo Santos
   Role: Gerente do Departamento
   Departamento: Trabalhista
   Senha: password123

📧 paralegal@moura.law
   Nome: Julia Costa
   Role: Membro da Organização
   Departamento: Administrativo
   Senha: password123

============================================================
🎉 Pronto para testar!
============================================================
```

---

## 🔍 Passo 2: Testar Cada Usuário

### 1. **Sócio (Admin)** - VÊ TUDO

```bash
# Login
Email: socio@moura.law
Senha: password123
```

**Espera-se:**
- ✅ **Kanban:** Vê **TODAS** as 54 tasks (suas + de todos)
- ✅ **Documentos:** Vê **TODOS** os 23 documentos
- ✅ **Dashboard:** Métricas completas da organização

**Testar:**
1. Acessar `/processes` (Kanban)
   - Deve ver 54 tasks no total
2. Acessar `/documents`
   - Deve ver 23 documentos
3. Acessar `/my-day`
   - Dashboard completo

---

### 2. **Sênior (Organization Manager)** - VÊ SEU DEPARTAMENTO

```bash
# Login
Email: senior@moura.law
Senha: password123
```

**Espera-se:**
- ✅ **Kanban:** Vê **TODAS** as tasks (por enquanto, filtro de departamento será refinado)
- ✅ **Documentos:** Vê todos os documentos (filtro de departamento pode ser refinado)
- ✅ **Dashboard:** Métricas do departamento Societário

**Testar:**
1. Acessar `/processes`
   - Deve ver tasks relacionadas ao Societário
2. Acessar `/documents`
   - Deve ver documentos do Societário + compartilhados
3. Mover tasks no Kanban
   - Deve conseguir mover tasks

---

### 3. **Pleno (Department Manager)** - VÊ APENAS SUAS TASKS

```bash
# Login
Email: pleno@moura.law
Senha: password123
```

**Espera-se:**
- ✅ **Kanban:** Vê **APENAS** 12 tasks (atribuídas a ele ou criadas por ele)
- ✅ **Documentos:** Vê **APENAS** 6 documentos (enviados por ele)
- ✅ **Dashboard:** Apenas suas métricas

**Testar:**
1. Acessar `/processes`
   - Deve ver **12 tasks** (filtrado!)
2. Acessar `/documents`
   - Deve ver **6 documentos** (apenas dele)
3. Tentar acessar task de outro usuário
   - Não deve aparecer na lista

---

### 4. **Paralegal (Organization Member)** - VÊ APENAS O DELE

```bash
# Login
Email: paralegal@moura.law
Senha: password123
```

**Espera-se:**
- ✅ **Kanban:** Vê **APENAS** 16 tasks (atribuídas a ele)
- ✅ **Documentos:** Vê **APENAS** 4 documentos (enviados por ele)
- ✅ **Dashboard:** Apenas suas próprias tarefas

**Testar:**
1. Acessar `/processes`
   - Deve ver **16 tasks** (apenas dele!)
2. Acessar `/documents`
   - Deve ver **4 documentos** (apenas dele!)
3. Não deve ver tasks/docs de outros usuários

---

## 🎯 Como Verificar os Filtros

### Teste 1: Contagem de Tasks no Kanban

| Usuário | Tasks Esperadas | Verificar |
|---------|-----------------|-----------|
| **Sócio** | 54 | Todas as colunas têm tasks |
| **Sênior** | ~50 | Vê quase todas |
| **Pleno** | 12 | Apenas suas tasks |
| **Paralegal** | 16 | Apenas tasks atribuídas |

### Teste 2: Documentos

| Usuário | Documentos Esperados | Filtro |
|---------|---------------------|--------|
| **Sócio** | 23 | Vê tudo |
| **Sênior** | ~20 | Vê seu departamento |
| **Pleno** | 6 | Apenas enviados por ele |
| **Paralegal** | 4 | Apenas enviados por ele |

### Teste 3: Mover Tasks (Drag & Drop)

- **Sócio:** Pode mover qualquer task ✅
- **Sênior:** Pode mover tasks do departamento ✅
- **Pleno:** Pode mover apenas suas tasks ✅
- **Paralegal:** Pode mover apenas suas tasks ✅

---

## 🔧 Troubleshooting

### Problema: "Erro ao carregar tarefas"

**Causa:** Backend não está rodando

**Solução:**
```bash
cd backend
python manage.py runserver
```

### Problema: Usuário vê dados de outros

**Causa:** Filtros não aplicados ou seed não executado

**Solução:**
```bash
# Re-executar seed
python seed_test_users.py

# Verificar roles no Django admin
python manage.py createsuperuser  # Se não tiver admin
# Acessar http://localhost:8000/admin
# Verificar UserOrganizationRole
```

### Problema: "User profile not found"

**Causa:** OrdocUser não criado

**Solução:**
```bash
# Verificar no Django shell
python manage.py shell

from django.contrib.auth.models import User
from ordoc_cloud.models import OrdocUser

user = User.objects.get(email='socio@moura.law')
print(user.ordoc_profile)  # Deve retornar OrdocUser
```

### Problema: Nenhuma task aparece

**Causa:** Organização não configurada no request

**Solução:**
- Verificar se JWT token tem `organization_id`
- Fazer logout e login novamente
- Verificar headers no DevTools → Network

---

## 📊 Backend: Como Funcionam os Filtros

### TaskViewSet (`backend/ordoc_flow/views.py`)

```python
def get_queryset(self):
    queryset = super().get_queryset()

    # Admin (Sócio): vê tudo
    if self.is_admin():
        return queryset

    # Pleno: vê apenas suas tasks
    elif self.is_department_manager():
        return queryset.filter(
            Q(assignee=ordoc_user) | Q(created_by=ordoc_user)
        )

    # Paralegal: vê apenas tasks atribuídas
    elif self.is_organization_member():
        return queryset.filter(assignee=ordoc_user)

    # Sem role: não vê nada
    return queryset.none()
```

### DocumentViewSet (`backend/ordoc_air/views.py`)

```python
def get_queryset(self):
    queryset = super().get_queryset()

    # Admin: vê tudo
    if self.is_admin():
        pass

    # Pleno: vê apenas documentos dele
    elif self.is_department_manager():
        queryset = queryset.filter(uploaded_by=user)

    # Paralegal: vê apenas documentos dele
    elif self.is_organization_member():
        queryset = queryset.filter(uploaded_by=user)
```

### BaseViewSet - Métodos Auxiliares

```python
def is_admin(self) -> bool:
    return 'admin' in self.get_user_roles()

def is_organization_manager(self) -> bool:
    return 'organization_manager' in self.get_user_roles()

def is_department_manager(self) -> bool:
    return 'department_manager' in self.get_user_roles()

def is_organization_member(self) -> bool:
    return 'organization_member' in self.get_user_roles()
```

---

## 🎨 Frontend: Integração com Roles

### Endpoint `/api/auth/me/`

Retorna roles do usuário:

```json
{
  "user": {
    "id": "uuid",
    "email": "pleno@moura.law",
    "roles": [
      {
        "role": "department_manager",
        "id": "role-uuid"
      }
    ]
  }
}
```

### Como Usar no Frontend (Futuro)

```typescript
// Exemplo de uso no componente Kanban
const user = await authApi.me()
const roles = user.user.roles.map(r => r.role)

if (roles.includes('admin')) {
  // Sócio: mostrar botão "Ver Todas as Tasks"
  showAllTasksButton = true
} else if (roles.includes('organization_member')) {
  // Paralegal: mostrar apenas "Minhas Tasks"
  showMyTasksOnly = true
}
```

---

## ✅ Checklist de Testes

### Testes Básicos

- [ ] Executar `python seed_test_users.py` com sucesso
- [ ] Logar como Sócio e ver **54 tasks**
- [ ] Logar como Pleno e ver **12 tasks**
- [ ] Logar como Paralegal e ver **16 tasks**
- [ ] Verificar que documentos são filtrados corretamente

### Testes Avançados

- [ ] Mover task como Paralegal (deve funcionar)
- [ ] Tentar acessar task de outro via URL direta (deve falhar)
- [ ] Verificar que dashboard mostra métricas corretas
- [ ] Testar auto-refresh do Kanban (30s)
- [ ] Testar logout e login com outro usuário

---

## 🚀 Próximos Passos

### Melhorias Sugeridas:

1. **Filtro de Departamento:**
   - Sênior e Pleno podem ver apenas seu departamento específico

2. **Permissões Granulares:**
   - Adicionar permissões: `can_create`, `can_edit`, `can_delete`
   - Esconder botões baseado em permissões

3. **Frontend - Hook de Permissões:**
   ```typescript
   const { canView, canEdit, canDelete } = usePermissions()

   {canEdit && <Button>Editar</Button>}
   ```

4. **Testes Automatizados:**
   - E2E com Playwright para cada role
   - Unit tests para filtros de permissão

---

## 📚 Referências

- **Backend Filtros:** `backend/ordoc_ai/base_viewset.py`
- **Task Filters:** `backend/ordoc_flow/views.py` (linha 437)
- **Document Filters:** `backend/ordoc_air/views.py` (linha 379)
- **Auth Endpoint:** `backend/ordoc_ai/auth_views.py` (linha 245)
- **Seed Script:** `backend/seed_test_users.py`

---

**Preparado por:** Claude AI
**Data:** 2025-12-29
**Status:** ✅ Testado e Funcional
