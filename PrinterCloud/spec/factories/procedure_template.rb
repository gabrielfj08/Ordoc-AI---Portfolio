FactoryBot.define do
  factory :procedure_template, class: 'Flow::ProcedureTemplate' do
    deleted_at { nil }
    organization { create(:organization) }
    description { 'Esse é o procedimento para abrir uma empresa' }
    name { 'Abrir empresa' }
    status { :active }
  end
end
