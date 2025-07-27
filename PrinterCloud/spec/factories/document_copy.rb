FactoryBot.define do
  factory :document_copy, class: 'PrinterAir::DocumentCopy' do
    created_by { create(:printer_cloud_user) }
    document
  end
end
