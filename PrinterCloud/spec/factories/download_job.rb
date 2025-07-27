FactoryBot.define do
  factory :download_job, class: 'PrinterAir::DownloadJob' do
    created_by { create(:printer_cloud_user) }
    s3_key { "development/#{CNPJ.generate}/folder/" }
  end
end
