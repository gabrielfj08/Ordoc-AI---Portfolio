FactoryBot.define do
  factory :printer_cloud_user_group, class: 'PrinterCloud::UserGroup' do
    sequence(:name) { |n| "grupo-#{n}" }
    status { :active }
    organization { build(:organization) }
    description { 'description' }
  end
end
