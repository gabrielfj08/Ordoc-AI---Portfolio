FactoryBot.define do
  factory :signature, class: 'PrinterSign::Signature' do
    service { 'printer_flow' }
    procedure { build(:printer_flow_procedure, :started) }
    requester { build(:internal_requester) }
    signable { build(:procedure_document) }
    created_by { build(:printer_cloud_user) }
  end
end
