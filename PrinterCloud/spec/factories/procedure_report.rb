FactoryBot.define do
  factory :procedure_report, class: 'PrinterFlow::ProcedureReport' do
    traits_for_enum :status, %i[created running finished failed]
    procedure { build(:priter_flow_procedure) }
    document { build(:printer_air_document) }
    created_by { build(:printer_cloud_user) }
  end
end
