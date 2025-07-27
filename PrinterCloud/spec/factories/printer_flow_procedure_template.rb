FactoryBot.define do
  factory :printer_flow_procedure_template, class: 'PrinterFlow::ProcedureTemplate' do
    name { 'Abrir empresa' }
    status { :active }
    source { 'internal_external' }
    organization { build(:organization) }
  end

  trait :child_template do
    after(:build) do |procedure_template|
      procedure_template.parent_procedure_template = create(:printer_flow_procedure_template)
      procedure_template.group_requester = create(:group_requester)
    end
  end
end
