FactoryBot.define do
  factory :field_attachment, class: 'PrinterFlow::FieldAttachment' do
    field_document_template { create(:field_document_template) }
    field { create(:field) }
  end
end
