FactoryBot.define do
  factory :document_upload_job, class: 'PrinterAir::DocumentUploadJob' do
    description { 'description' }
    location { 'Printer do Brasil - Curitiba' }
    created_by_id { 1 }
    s3_key { "development/#{CNPJ.generate}/folder/zipfile.zip" }
  end
end
