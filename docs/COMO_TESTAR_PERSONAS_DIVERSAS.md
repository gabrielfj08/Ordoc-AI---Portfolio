# 🎭 Como Testar 4 Personas Completamente Diferentes

**Data:** 2025-12-29
**Status:** ✅ Pronto para Uso

---

## 📋 Objetivo

Demonstrar a **versatilidade** da plataforma Ordoc-AI com **4 CENÁRIOS COMPLETAMENTE DIFERENTES**:

1. 👨‍⚖️ **Advogada** - Escritório com equipe
2. 👨‍⚕️ **Médico** - Clínica própria
3. 👨‍💼 **Servidor Público** - Órgão governamental
4. 👨‍💻 **Designer Freelancer** - Autônoma/MEI

Cada persona tem **profissão diferente**, **documentos diferentes**, **contextos diferentes** e **níveis de acesso diferentes**.

---

## 🚀 Passo 1: Popular o Banco de Dados

### Executar Script de Seed

```bash
# 1. Navegar para o backend
cd /home/user/ordoc-ai/backend

# 2. Executar script de seed de personas diversas
python seed_diverse_personas.py
```

### O Que o Script Cria:

---

## 👨‍⚖️ PERSONA 1: Dra. Ana Silva - Advogada Trabalhista

**Email:** `ana.silva@silvaadvocacia.com.br`
**Senha:** `advogada123`
**Role:** `admin` (Sócia do escritório)

### Contexto:
- ✅ **Organização:** Silva & Associados Advocacia
- ✅ **Departamentos:**
  - Direito Trabalhista
  - Contratos Empresariais
- ✅ **Tem equipe:** Sim (é sócia)
- ✅ **Tipo de trabalho:** Processos judiciais, contratos, pareceres

### Documentos Criados (7):
- Petição Inicial - Reclamação Trabalhista
- Contrato de Prestação de Serviços
- Parecer Jurídico - Rescisão Contratual
- Procuração Ad Judicia
- Acordo Trabalhista
- Petição de Recurso Ordinário
- Contrato de Sociedade

### Procedures e Tasks:
- 3 Procedures (casos trabalhistas em andamento)
- ~13 Tasks (análise de docs, petições, audiências, acordos)

**O Que Esperar:**
- Vê **TODOS** os documentos e tasks (role admin)
- Pode criar novos casos e delegar tarefas
- Acesso completo ao sistema do escritório

---

## 👨‍⚕️ PERSONA 2: Dr. Carlos Mendes - Médico Cardiologista

**Email:** `dr.carlos@cardiovida.med.br`
**Senha:** `medico123`
**Role:** `admin` (Dono da clínica)

### Contexto:
- ✅ **Organização:** Clínica CardioVida - Dr. Carlos Mendes
- ✅ **Departamentos:**
  - Cardiologia
- ✅ **Tem equipe:** Não (trabalha sozinho ou com assistentes)
- ✅ **Tipo de trabalho:** Atendimentos, exames, acompanhamentos

### Documentos Criados (9):
- Prontuário Médico - Paciente João Silva
- Laudo de Ecocardiograma
- Prescrição Médica - Tratamento Hipertensão
- Resultado Holter 24h
- Relatório de Consulta - Check-up Cardiológico
- Laudo de Teste Ergométrico
- Solicitação de Exames Complementares
- Atestado Médico
- Protocolo de Acompanhamento Pós-Infarto

### Procedures e Tasks:
- 4 Procedures (acompanhamentos de pacientes)
- ~14 Tasks (consultas, exames, análises, retornos)

**O Que Esperar:**
- Vê **TODOS** os documentos médicos (role admin da clínica)
- Gerencia prontuários e laudos
- Controla acompanhamento de pacientes

---

## 👨‍💼 PERSONA 3: Roberto Oliveira - Servidor Público (Analista)

**Email:** `roberto.oliveira@prefeitura.sp.gov.br`
**Senha:** `servidor123`
**Role:** `department_manager` (Gerente de Departamento)

### Contexto:
- ✅ **Organização:** Prefeitura Municipal de SP - Secretaria de Obras
- ✅ **Departamentos:**
  - Licitações e Contratos
  - Fiscalização de Obras
- ✅ **Tem equipe:** Sim (parte de equipe grande, gerente de departamento)
- ✅ **Tipo de trabalho:** Licitações, processos administrativos, fiscalização

### Documentos Criados (9):
- Edital de Licitação - Pavimentação Avenida Principal
- Processo Administrativo 2024-0123
- Parecer Técnico - Viabilidade Obra Ponte Nova
- Termo de Referência - Fiscalização de Obras
- Relatório de Vistoria - Obra Centro Cultural
- Ata de Julgamento - Licitação 001/2024
- Contrato Administrativo 045/2024
- Notificação à Empresa Contratada
- Medição de Obra - Dezembro 2024

### Procedures e Tasks:
- 3 Procedures (licitações e fiscalizações)
- ~17 Tasks (elaboração de editais, julgamento, fiscalização)

**O Que Esperar:**
- Vê **APENAS** documentos e tasks do SEU departamento (role department_manager)
- Pode gerenciar processos que está envolvido
- Acesso restrito comparado ao secretário (admin)

---

## 👨‍💻 PERSONA 4: Juliana Costa - Designer Gráfica Freelancer

**Email:** `juliana.costa@julianadesign.com.br`
**Senha:** `designer123`
**Role:** `organization_member` (MEI/Freelancer)

### Contexto:
- ✅ **Organização:** Juliana Costa - Design Gráfico (MEI)
- ✅ **Departamentos:**
  - Projetos de Design
- ✅ **Tem equipe:** **NÃO** (trabalha sozinha, freelancer)
- ✅ **Tipo de trabalho:** Identidade visual, branding, design gráfico

### Documentos Criados (10):
- Proposta Comercial - Identidade Visual Restaurante XYZ
- Briefing - Projeto Branding Startup Tech
- Arte Final - Logo Empresa ABC
- Mockup - Material Gráfico Evento 2024
- Contrato de Prestação de Serviços
- Orçamento - Criação de Site Institucional
- Portfólio - Projetos 2024
- NFSe - Serviço Prestado Cliente GHI
- Briefing Criativo - Campanha Redes Sociais
- Apresentação - Proposta Redesign Marca

### Procedures e Tasks:
- 4 Procedures (projetos de clientes)
- ~23 Tasks (briefing, pesquisa, criação, apresentação, revisões)

**O Que Esperar:**
- Vê **APENAS** suas próprias tasks e documentos (role organization_member)
- Acesso mais restrito (nível mais baixo de permissão)
- Gerencia seus próprios projetos de design

---

## 🎯 Como Testar Cada Persona

### 1. Testar Advogada (Admin)

```bash
# Login
Email: ana.silva@silvaadvocacia.com.br
Senha: advogada123
```

**Espera-se:**
- ✅ **Kanban:** Vê TODAS as ~13 tasks do escritório
- ✅ **Documentos:** Vê TODOS os 7 documentos jurídicos
- ✅ **Dashboard:** Métricas completas do escritório
- ✅ **Pode:** Criar novos casos, delegar tasks, ver tudo

---

### 2. Testar Médico (Admin)

```bash
# Login
Email: dr.carlos@cardiovida.med.br
Senha: medico123
```

**Espera-se:**
- ✅ **Kanban:** Vê TODAS as ~14 tasks (acompanhamentos médicos)
- ✅ **Documentos:** Vê TODOS os 9 documentos médicos (prontuários, laudos)
- ✅ **Dashboard:** Métricas da clínica
- ✅ **Pode:** Gerenciar pacientes, exames, consultas

**Diferença da Advogada:**
- Documentos são **MÉDICOS** (laudos, prontuários) vs JURÍDICOS (petições, contratos)
- Contexto de **saúde** vs contexto **jurídico**

---

### 3. Testar Servidor Público (Department Manager)

```bash
# Login
Email: roberto.oliveira@prefeitura.sp.gov.br
Senha: servidor123
```

**Espera-se:**
- ⚠️ **Kanban:** Vê APENAS ~17 tasks (do SEU departamento)
- ⚠️ **Documentos:** Vê APENAS 9 documentos (do SEU departamento)
- ✅ **Dashboard:** Métricas do departamento
- ⚠️ **NÃO vê:** Tasks de outros departamentos da Prefeitura

**Diferença dos anteriores:**
- **ACESSO RESTRITO** - Não vê tudo como Admin
- Documentos são **PÚBLICOS** (editais, licitações) vs privados
- Contexto **governamental** vs privado

---

### 4. Testar Designer Freelancer (Organization Member)

```bash
# Login
Email: juliana.costa@julianadesign.com.br
Senha: designer123
```

**Espera-se:**
- ⚠️ **Kanban:** Vê APENAS ~23 tasks (APENAS DELA, ninguém mais)
- ⚠️ **Documentos:** Vê APENAS 10 documentos (APENAS DELA)
- ✅ **Dashboard:** Apenas suas próprias métricas
- ⚠️ **NÃO vê:** Tasks de outras pessoas (não tem equipe)

**Diferença de todos:**
- **ACESSO MAIS RESTRITO** (nível mais baixo)
- Trabalha **SOZINHA** (sem equipe)
- Documentos são de **DESIGN** (artes, propostas) vs outros tipos
- Contexto **freelancer/autônomo** vs organização estruturada

---

## 📊 Comparação de Acesso

| Persona | Role | Vê Tasks | Vê Documentos | Tem Equipe | Contexto |
|---------|------|----------|---------------|------------|----------|
| **Advogada** | admin | ✅ Todas (13) | ✅ Todos (7) | ✅ Sim | Escritório advocacia |
| **Médico** | admin | ✅ Todas (14) | ✅ Todos (9) | ⚠️ Pequena | Clínica própria |
| **Servidor** | department_manager | ⚠️ Só departamento (17) | ⚠️ Só departamento (9) | ✅ Sim | Órgão público |
| **Designer** | organization_member | ❌ Só dela (23) | ❌ Só dela (10) | ❌ Não | Freelancer/MEI |

---

## ✅ Checklist de Testes

### Teste 1: Contextos Diferentes
- [ ] Advogada: documentos **jurídicos** (petições, contratos)
- [ ] Médico: documentos **médicos** (laudos, prontuários)
- [ ] Servidor: documentos **públicos** (editais, licitações)
- [ ] Designer: documentos de **design** (artes, propostas)

### Teste 2: Níveis de Acesso
- [ ] Advogada (admin): vê **TUDO** do escritório
- [ ] Médico (admin): vê **TUDO** da clínica
- [ ] Servidor (department_manager): vê **APENAS** seu departamento
- [ ] Designer (organization_member): vê **APENAS** seus próprios itens

### Teste 3: Estruturas Diferentes
- [ ] Advogada: **2 departamentos** (Trabalhista, Contratos)
- [ ] Médico: **1 departamento** (Cardiologia)
- [ ] Servidor: **2 departamentos** (Licitações, Fiscalização)
- [ ] Designer: **1 departamento** (Projetos)

### Teste 4: Tipos de Trabalho
- [ ] Advogada: **processos judiciais**, casos trabalhistas
- [ ] Médico: **atendimentos médicos**, acompanhamentos
- [ ] Servidor: **licitações públicas**, fiscalização de obras
- [ ] Designer: **projetos de design**, identidade visual

---

## 🎉 Resultado Esperado

Após testar as 4 personas, você deve ver:

1. ✅ **Diversidade de Profissões:** Advocacia, Medicina, Setor Público, Design
2. ✅ **Documentos Específicos:** Cada profissão tem documentos realistas
3. ✅ **Níveis de Acesso Diferentes:** Admin, Department Manager, Organization Member
4. ✅ **Contextos Variados:** Escritório, Clínica, Órgão Público, Freelancer
5. ✅ **Estruturas Organizacionais Diversas:** Com equipe, sem equipe, grande, pequena

---

## 📚 Referências

- **Seed Script:** `backend/seed_diverse_personas.py`
- **Documentação de Correção:** `CORREÇÃO_ERROS_500.md`

---

**Preparado por:** Claude AI
**Data:** 2025-12-29
**Status:** ✅ 4 Personas Diversas Prontas para Teste
