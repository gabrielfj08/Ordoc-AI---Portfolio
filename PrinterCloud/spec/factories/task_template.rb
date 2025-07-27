FactoryBot.define do
  factory :task_template, class: 'PrinterFlow::TaskTemplate' do
    traits_for_enum :status, %i[active inactive]
    name { 'Solicitar CPF' }
    description { 'Tipo de tarefa padrão para solicitação de cpf' }
    organization { build(:organization) }
  end
end
