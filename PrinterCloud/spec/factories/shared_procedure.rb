FactoryBot.define do
  factory :shared_procedure, class: 'PrinterFlow::External::SharedProcedure' do
    traits_for_enum :status, %i[created accepted refused]

    created_by { build(:external_requester) }
    external_requester { build(:external_requester) }
    procedure { build(:printer_flow_procedure) }
  end
end
