FactoryBot.define do
  factory :directory_upload_job, class: 'PrinterAir::DirectoryUploadJob' do
    description { 'Some description' }
    location { 'Printer do Brasil - Curitiba' }
    created_by { create(:printer_cloud_user) }
    s3_key { "development/#{CNPJ.generate}/folder/" }
  end
end
