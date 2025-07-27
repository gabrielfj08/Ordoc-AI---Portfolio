FactoryBot.define do
  factory :procedure_document, class: 'PrinterFlow::ProcedureDocument' do
    name { 'Edital' }
    document { build(:printer_air_document) }
    s3_key { 'development/04916444000122/Meu Air/Printer Flow/Anexos do Processo/postman.png' }
    key { 'development/04916444000122/Meu Air/Printer Flow/Anexos do Processo/postman.png' }
    source { 'upload' }
    procedure do
      build(:printer_flow_procedure, :with_attachment_field, :started, organization: organization,
                                                                       created_by: created_by)
    end
    organization { build(:organization) }
    created_by { build(:printer_cloud_user) }
  end
end
