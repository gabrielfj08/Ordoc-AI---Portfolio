FactoryBot.define do
  factory :procedure_template_document, class: 'PrinterFlow::ProcedureTemplateDocument' do
    name { 'Edital' }
    document { build(:printer_air_document) }
    s3_key { 'development/04916444000122/Meu Air/Printer Flow/documento-de-residencia-66984303.jpg' }
  end
end
