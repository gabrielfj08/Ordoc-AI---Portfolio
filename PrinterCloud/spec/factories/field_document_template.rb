FactoryBot.define do
  factory :field_document_template, class: 'PrinterFlow::FieldDocumentTemplate' do
    traits_for_enum :status, %i[draft running started finished]

    name { 'Comprovante de Residência' }
    document { build(:printer_air_document) }
    s3_key { 'development/04916444000122/Meu Air/Printer Flow/documento-de-residencia-66984303.jpg' }
    created_by { build(:printer_cloud_user, organization: organization) }
    organization { build(:organization) }
  end
end
