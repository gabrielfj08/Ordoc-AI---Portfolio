FactoryBot.define do
  factory :task_document, class: 'PrinterFlow::TaskDocument' do
    name { 'Edital' }
    document { build(:printer_air_document) }
    s3_key { 'development/04916444000122/Meu Air/Printer Flow/Anexos do Processo/postman.png' }
    key { 'development/04916444000122/Meu Air/Printer Flow/Anexos do Processo/postman.png' }
    source { 'upload' }
    task { build(:printer_flow_task) }
    created_by { build(:printer_cloud_user) }
  end
end
