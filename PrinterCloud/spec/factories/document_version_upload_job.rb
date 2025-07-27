FactoryBot.define do
  factory :document_version_upload_job, class: 'PrinterAir::DocumentVersionUploadJob' do
    description { 'description' }
    location { 'Printer do Brasil - Curitiba' }
    created_by { build(:printer_cloud_user) }
    document { build(:printer_air_document) }
    s3_key { "development/#{CNPJ.generate}/folder/zipfile.zip" }
  end
end
