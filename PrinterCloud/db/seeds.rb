# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'
Faker::Config.locale = 'pt-BR'
organization = Organization.create!(cnpj: '04916444000122', corporate_name: 'Printer do Brasil', email: 'contato@printerdobrasil.com.br',
                                    logo_url: 'https://printer-cloud-assets.s3.sa-east-1.amazonaws.com/development/logo/1/printer.png',
                                    phone: '4133878613', site: 'https://printerdobrasil.com.br/', contact_name: 'Aparecido Porfirio dos Santos',
                                    contact_phone: '4133878613', recycle_bin: RecycleBin.new, subdomain: 'printerdobrasil')

theme = organization.create_theme!(image_url: 'https://printer-flow-external-assets.s3.sa-east-1.amazonaws.com/development/image/1/Printer+do+Brasil_+.png',
                                   background_url: 'https://printer-flow-external-assets.s3.sa-east-1.amazonaws.com/development/background/1/Printer+NEW__-01.png',
                                   color: 'cid_orange')

deny_directory = PrinterCloud::Policy.create!(name: 'PrinterFlowDenyDirectory', description: 'Permissão de negação para ações nos diretórios do Printer Flow.',
                                              organization_id: organization.id, effect: 'deny', source: 'printer_cloud_managed', service: :printer_air,
                                              resource: ["prn:printer_air:#{organization.cnpj}:Meu Air/Printer Flow - Private/",
                                                         "prn:printer_air:#{organization.cnpj}:Meu Air/Printer Flow - Private/*",
                                                         "prn:printer_air:#{organization.cnpj}:Meu Air/Printer Flow/",
                                                         "prn:printer_air:#{organization.cnpj}:Meu Air/Printer Flow/*"])

admin = User.create!(email: 'parateste@printerdobrasil.com.br', name: 'Usuário Externo', phone: '41999999999', password: '12345678Ab!', organization_id: organization.id,
                     inbox: Inbox.new, cpf: Faker::CPF.numeric, date_of_birth: Faker::Date.birthday, avatar_url: 'https://cf.shopee.com.br/file/fb06a007bd56094d0194fb23bfb77913',
                     confirmed_at: Time.now, status: 'active', admin: true, username: 'admin')
manager = User.create!(email: 'manager.printercloud@gmail.com', name: 'Manager', phone: '41988888889', password: '12345678Ab!', organization_id: organization.id,
                       inbox: Inbox.new, cpf: Faker::CPF.numeric, date_of_birth: Faker::Date.birthday, avatar_url: 'https://cf.shopee.com.br/file/fb06a007bd56094d0194fb23bfb77913',
                       confirmed_at: Time.now, status: 'active', username: 'manager')
user = User.create!(email: 'user.printercloud@gmail.com', name: 'User', phone: '41977777779', password: '12345678Ab!', organization_id: organization.id,
                    inbox: Inbox.new, cpf: Faker::CPF.numeric, date_of_birth: Faker::Date.birthday, avatar_url: 'https://cf.shopee.com.br/file/fb06a007bd56094d0194fb23bfb77913',
                    confirmed_at: Time.now, status: 'active', username: 'user')

printer_cloud_user = PrinterCloud::User.create!(email: 'fabianavitoriaramos@gmail.com', name: 'User Printer Cloud', phone: '41987257639', password: '12345678Ab!',
                                                cpf: Faker::CPF.numeric, date_of_birth: Faker::Date.birthday, avatar_url: 'https://cf.shopee.com.br/file/fb06a007bd56094d0194fb23bfb77913',
                                                confirmed_at: Time.now, status: 'active', username: 'user.cloud', organization_id: organization.id)

printer_cloud_user_group = PrinterCloud::UserGroup.create!(name: 'Amigos-do-Backend', description: 'Pessoal do Backend',
                                                           status: 'active', organization_id: organization.id)

organization.create_address!(street: 'Rua Lamenha Lins', number: 1900, complement: 'apto 10', postal_code: '80820080',
                             city: 'Curitiba', state: 'PR', neighborhood: 'Rebouças')

root_directory = organization.create_root_directory!(created_by_id: ENV['PRINTER_CLOUD_USER_ID'],
                                                     updated_by_id: ENV['PRINTER_CLOUD_USER_ID'])
organization.create_recycle_bin_directory!(created_by_id: ENV['PRINTER_CLOUD_USER_ID'],
                                           updated_by_id: ENV['PRINTER_CLOUD_USER_ID'])

department = organization.departments.create!(name: 'Administração', description: 'Atividades administrativas')

directory = department.directories.create!(name: 'Cadastros', description: 'Dados cadastrais dos usuários',
                                           created_by: user, organization_id: organization.id)

printer_air_directory_first = root_directory.children_directories.new(name: 'Cadastros', description: 'Dados cadastrais dos usuários',
                                                                      created_by: printer_cloud_user, organization_id: organization.id, updated_by: printer_cloud_user)
printer_air_directory_first.save!
printer_air_directory_second = root_directory.children_directories.new(name: 'Financeiro', description: 'Dados financeiros dos usuários',
                                                                       created_by: printer_cloud_user, organization_id: organization.id, updated_by: printer_cloud_user)
printer_air_directory_second.save!

printer_air_document_first = PrinterAir::Document.create!(original_filename: 'Aditivo.pdf', directory_id: printer_air_directory_first.id,
                                                          created_by_id: admin.id, updated_by_id: admin.id)

printer_air_document_first.file.attach(io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'file.png')),
                                       filename: 'file.png',
                                       content_type: 'image/png')

printer_air_document_second = PrinterAir::Document.create!(original_filename: 'Aditivo_2.pdf', directory_id: printer_air_directory_second.id,
                                                           created_by_id: admin.id, updated_by_id: admin.id)

printer_air_document_second.file.attach(io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'file.png')),
                                        filename: 'file.png',
                                        content_type: 'image/png')

shareable_link = printer_air_document_first.shareable_links.create!(expires_in: nil,
                                                                    created_by_id: printer_cloud_user.id)

partaker = Flow::Partaker.create!(organization_id: organization.id, name: 'Partaker', cpf_cnpj: Faker::CPF.numeric,
                                  email: Faker::Internet.email, address: 'Rua Desembargador Arthur Leme, 327', phone: '41966666666')

procedure_template = Flow::ProcedureTemplate.create!(organization_id: organization.id, name: 'Licitação',
                                                     description: 'Template para processos de licitação')

procedure = Flow::Procedure.create!(department_id: department.id, name: 'Processos', procedure_template_id: procedure_template.id,
                                    description: 'Processos', created_by_id: user.id)

procedure.requesters = [partaker]

task = Flow::Task.create!(description: 'Task description', name: 'Task name', procedure_id: procedure.id)

user_group = Flow::UserGroup.create!(name: 'User group', organization_id: organization.id)

user_group.users = [manager, user, admin]

group_requester = ::PrinterFlowServices::GroupRequesterCreator.new({ name: 'Group requester', organization_id: organization.id,
                                                                     code: '1' }).call

internal_requester = PrinterFlow::InternalRequester.first

internal_requester.create_address!(street: 'Rua Lamenha Lins', number: 1900, complement: 'apto 10', postal_code: '80820080',
                                   city: 'Curitiba', state: 'PR', neighborhood: 'Rebouças')

group_requester.users << printer_cloud_user

external_requester = ::PrinterFlow::ExternalRequester.create!(name: 'Victor Porfirio', cpf_cnpj: Faker::CPF.numeric,
                                                              organization_id: organization.id,  email: Faker::Internet.email,
                                                              birth_date: '01/01/2001', phone: '41338786133', notification: :email)

printer_flow_procedure_template = ::PrinterFlow::ProcedureTemplate.create!(name: 'Protocolo', status: :active,
                                                                           source: :internal_external, organization_id: organization.id)
printer_flow_child_procedure_template = ::PrinterFlow::ProcedureTemplate.create!(name: 'IPTU', status: :active,
                                                                                 parent_procedure_template_id: printer_flow_procedure_template.id,
                                                                                 source: :internal_external, organization_id: organization.id,
                                                                                 group_requester_id: group_requester.id)

printer_flow_select_field = ::PrinterFlow::Field.create!(procedure_template_id: printer_flow_child_procedure_template.id,
                                                         label: 'Estado Civil', field_type: :radio)

printer_flow_select_field.field_value_options.create!(value: 'Solteira(o)')
printer_flow_select_field.field_value_options.create!(value: 'Casada(o)')
printer_flow_select_field.field_value_options.create!(value: 'União Estável')

printer_flow_short_text_field = ::PrinterFlow::Field.create!(procedure_template_id: printer_flow_child_procedure_template.id,
                                                             label: 'Nome', field_type: :short_text)
printer_flow_long_text_field = ::PrinterFlow::Field.create!(procedure_template_id: printer_flow_child_procedure_template.id,
                                                            label: 'Texto Longo', field_type: :long_text)
printer_flow_cpf_field = ::PrinterFlow::Field.create!(procedure_template_id: printer_flow_child_procedure_template.id,
                                                      label: 'Cpf', field_type: :cpf)

printer_flow_procedure = group_requester.procedures.create!(procedure_template_id: printer_flow_child_procedure_template.id, source: :internal, organization_id: organization.id,
                                                            requester_id: internal_requester.id, created_by_id: printer_cloud_user.id, schema: [{ 'label' => 'Nome', 'field_type' => 'short_text' }, { 'label' => 'Texto Longo', 'field_type' => 'long_text' },
                                                                                                                                                { 'label' => 'Cpf', 'field_type' => 'cpf' }, { 'label' => 'Estado Civil', 'field_type' => 'radio',
                                                                                                                                                                                               'options' => ['Solteira(o)', 'Casada(o)', 'União Estável'] }])

printer_flow_justification_procedure = printer_flow_procedure.justification_notes.create!(note: "Processo criado por #{user.internal_requester.name}, no dia #{Date.current.strftime('%d/%m/%Y')}, às #{Time.now.in_time_zone('America/Sao_Paulo').strftime('%Hh%M')}",
                                                                                          action: 'create',
                                                                                          created_by_id: printer_cloud_user.internal_requester.id)

printer_flow_task = printer_flow_procedure.tasks.create!(name: 'Assinaturas do Backend',
                                                         description: 'Assina este documento para prosseguir com o processo', created_by_id: printer_cloud_user.id)

printer_flow_task_template = ::PrinterFlow::TaskTemplate.create!(name: 'Assinaturas do Backend', status: :active,
                                                                 description: 'description', organization_id: organization.id)

printer_flow_short_text_task_field = printer_flow_task_template.task_fields.create!(label: 'Nome',
                                                                                    field_type: :short_text)

printer_flow_long_text_task_field = printer_flow_task_template.task_fields.create!(label: 'Texto Longo',
                                                                                   field_type: :long_text)

printer_flow_cpf_task_field = printer_flow_task_template.task_fields.create!(label: 'Cpf', field_type: :cpf)

Role.create!(user_id: User.first.id, type: Roles::ADMIN)
Role.create!(user_id: User.second.id, type: Roles::ORGANIZATION_MANAGER, organization_id: organization.id)
Role.create!(user_id: User.third.id, type: Roles::ORGANIZATION_MEMBER, organization_id: organization.id)
Role.create!(user_id: User.third.id, type: Roles::DEPARTMENT_MEMBER, department_id: department.id)

App.create!(name: 'Printer Cloud', service: :printer_cloud,
            description: 'Plataforma em cloud para gestão de aplicativos. A ferramenta responsável por criação de permissão de acesso e controle de segurança.')
App.create!(name: 'Printer Air', service: :printer_air,
            description: 'Mais que armazenamento de documentos e arquivos, uma poderosa ferramenta de gerenciamento de arquivos.')
App.create!(name: 'Printer Flow', service: :printer_flow,
            description: 'Conectividade e segurança, tudo em um só lugar. A ferramenta ideal para a tramitação digital e assinatura de documentos.')
App.create!(name: 'Printer Reports', service: :printer_reports,
            description: 'Seus dados na palma da mão. Visualize dados de uso da sua instituição.')

organization.apps = App.all

organization.create_default_reports

PrinterCloud::PolicyAction.create!(access_level: 'list', service: 'printer_cloud', action: 'list',
                                   resource: 'user_group', label: 'Listar grupos')
PrinterCloud::PolicyAction.create!(access_level: 'read', service: 'printer_cloud', action: 'read',
                                   resource: 'user_group', label: 'Visualizar grupo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'create',
                                   resource: 'user_group', label: 'Criar grupo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'update',
                                   resource: 'user_group', label: 'Editar grupo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'delete',
                                   resource: 'user_group', label: 'Deletar grupo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'attach_user_to_group',
                                   resource: 'user_group', label: 'Adicionar usuário ao grupo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'detach_user_from_group',
                                   resource: 'user_group', label: 'Remover usuário do grupo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'attach_policy_to_group',
                                   resource: 'user_group', label: 'Adicionar permissão ao grupo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'detach_policy_from_group',
                                   resource: 'user_group', label: 'Remover permissão do grupo')

PrinterCloud::PolicyAction.create!(access_level: 'list', service: 'printer_cloud', action: 'list',
                                   resource: 'policy', label: 'Listar permissões')
PrinterCloud::PolicyAction.create!(access_level: 'read', service: 'printer_cloud', action: 'read',
                                   resource: 'policy', label: 'Visualizar permissão')
PrinterCloud::PolicyAction.create(access_level: 'write', service: 'printer_cloud', action: 'create',
                                  resource: 'policy', label: 'Criar permissão')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'update',
                                   resource: 'policy', label: 'Editar permissão')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'delete',
                                   resource: 'policy', label: 'Deletar permissão')

PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'update',
                                   resource: 'organization', label: 'Editar instituição')

PrinterCloud::PolicyAction.create!(access_level: 'list', service: 'printer_reports', action: 'list',
                                   resource: 'report', label: 'Listar relatório')

PrinterCloud::PolicyAction.create!(access_level: 'list', service: 'printer_air', action: 'list',
                                   resource: 'directory', label: 'Listar pasta')
PrinterCloud::PolicyAction.create!(access_level: 'read', service: 'printer_air', action: 'read',
                                   resource: 'directory', label: 'Visualizar pasta')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'update',
                                   resource: 'directory', label: 'Atualizar pasta')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'create',
                                   resource: 'directory', label: 'Criar pasta')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'delete',
                                   resource: 'directory', label: 'Deletar pasta')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'share',
                                   resource: 'directory', label: 'Compartilhar pasta')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'restore',
                                   resource: 'directory', label: 'Restaurar pasta')

PrinterCloud::PolicyAction.create!(access_level: 'list', service: 'printer_air', action: 'list',
                                   resource: 'document', label: 'Listar documentos')
PrinterCloud::PolicyAction.create!(access_level: 'read', service: 'printer_air', action: 'read',
                                   resource: 'document', label: 'Visualizar documento')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'update',
                                   resource: 'document', label: 'Atualizar documento')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'create',
                                   resource: 'document', label: 'Criar documento')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'delete',
                                   resource: 'document', label: 'Deletar documento')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'share',
                                   resource: 'document', label: 'Compartilhar documento')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_air', action: 'restore',
                                   resource: 'document', label: 'Restaurar documento')

PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'create',
                                   resource: 'user', label: 'Criar usuário')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'delete',
                                   resource: 'user', label: 'Deletar usuário')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'update',
                                   resource: 'user', label: 'Atualizar usuário')
PrinterCloud::PolicyAction.create!(access_level: 'list', service: 'printer_cloud', action: 'list',
                                   resource: 'user', label: 'Listar usuário')
PrinterCloud::PolicyAction.create!(access_level: 'read', service: 'printer_cloud', action: 'read',
                                   resource: 'user', label: 'Visualizar usuário')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'attach_policy_to_user',
                                   resource: 'user', label: 'Adicionar permissão ao usuário')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_cloud', action: 'detach_policy_from_user',
                                   resource: 'user', label: 'Remover permissão do usuário')

PrinterCloud::PolicyAction.create!(access_level: 'list', service: 'printer_flow', action: 'list',
                                   resource: 'requester', label: 'Listar solicitantes')
PrinterCloud::PolicyAction.create!(access_level: 'read', service: 'printer_flow', action: 'read',
                                   resource: 'requester', label: 'Visualizar solicitante')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_flow', action: 'create',
                                   resource: 'requester', label: 'Criar solicitante')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_flow', action: 'update',
                                   resource: 'requester', label: 'Atualizar solicitante')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_flow', action: 'add_requester_to_group',
                                   resource: 'requester', label: 'Adicionar solicitante ao grupo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_flow', action: 'remove_requester_from_group',
                                   resource: 'requester', label: 'Remover solicitante do grupo')

PrinterCloud::PolicyAction.create!(access_level: 'list', service: 'printer_flow', action: 'list',
                                   resource: 'procedure_template', label: 'Listar tipo de processo')
PrinterCloud::PolicyAction.create!(access_level: 'read', service: 'printer_flow', action: 'read',
                                   resource: 'procedure_template', label: 'Visualizar tipo de processo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_flow', action: 'create',
                                   resource: 'procedure_template', label: 'Criar tipo de processo')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_flow', action: 'update',
                                   resource: 'procedure_template', label: 'Atualizar tipo de processo')

PrinterCloud::PolicyAction.create!(access_level: 'list', service: 'printer_flow', action: 'list',
                                   resource: 'task_template', label: 'Listar tipo de tarefa')
PrinterCloud::PolicyAction.create!(access_level: 'read', service: 'printer_flow', action: 'read',
                                   resource: 'task_template', label: 'Visualizar tipo de tarefa')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_flow', action: 'create',
                                   resource: 'task_template', label: 'Criar tipo de tarefa')
PrinterCloud::PolicyAction.create!(access_level: 'write', service: 'printer_flow', action: 'update',
                                   resource: 'task_template', label: 'Atualizar tipo de tarefa')

policy = PrinterCloud::Policy.create!(name: 'Lista-de-User-Groups', description: 'Permissão para listar grupos',
                                      organization_id: organization.id, effect: 'allow', source: 'customer_managed', service: :printer_cloud, resource: [printer_cloud_user_group.prn])
policy.actions << PrinterCloud::PolicyAction.first
default_admin_policies = PrinterCloud::Policy.new(name: 'admin_full_acess', description: 'Permissões para admin',
                                                  organization_id: organization.id, service: :printer_cloud, effect: 'allow', source: 'customer_managed',
                                                  resource: ['prn:*'])
default_admin_policies.generate_prn
default_admin_policies.save!(validate: false)

default_admin_policies.actions << PrinterCloud::PolicyAction.all
printer_cloud_user.policies << default_admin_policies
deny_directory.actions << PrinterCloud::PolicyAction.where(service: 'printer_air', resource: 'directory')

ContactInformation.create!(name: 'PRINTER DO BRASIL TECNOLOGIA DA INFORMACAO LTDA',
                           cnpj: '04.916.444/0001-22',
                           site: 'hhttps://www.printerdobrasil.com.br/',
                           contact_name: 'Porfírio',
                           email: 'contato@printerdobrasil.com.br',
                           phone: '(41) 3387-8613',
                           whatsapp: '(41) 98400-0929',
                           address: 'Rua Desembargador Arthur Leme, 327, Bacacheri - Curitiba - Paraná')
