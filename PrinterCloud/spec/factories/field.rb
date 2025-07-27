FactoryBot.define do
  factory :field, class: 'PrinterFlow::Field' do
    field_type { :cpf }
    label { 'CPF' }
    procedure_template { build(:printer_flow_procedure_template) }
  end
end
