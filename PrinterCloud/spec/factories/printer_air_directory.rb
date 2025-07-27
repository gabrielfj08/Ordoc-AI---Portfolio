FactoryBot.define do
  factory :printer_air_directory, class: 'PrinterAir::Directory' do
    sequence(:name) { |n| "directory-#{n}" }
    description { 'description' }
    organization { create(:organization) }
    created_by { create(:printer_cloud_user) }
    updated_by { create(:printer_cloud_user) }
    parent_directory { organization.root_directory }
  end
end
