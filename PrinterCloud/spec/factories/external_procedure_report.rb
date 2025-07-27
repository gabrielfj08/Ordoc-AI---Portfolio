FactoryBot.define do
  factory :external_procedure_report, class: 'PrinterFlow::External::ProcedureReport' do
    procedure { build(:printer_flow_procedure) }
    document { build(:printer_air_document) }
  end
end
