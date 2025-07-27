FactoryBot.define do
  factory :directory_info, class: 'PrinterAir::DirectoryInfo' do
    total_size { '1 MB' }
    total_directories_count { 1 }
    total_documents_count { 1 }
    directory
    created_by { create(:printer_cloud_user) }
  end
end
