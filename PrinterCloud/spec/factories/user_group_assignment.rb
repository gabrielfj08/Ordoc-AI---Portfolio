FactoryBot.define do
  factory :user_group_assignment, class: 'PrinterCloud::UserGroupAssignment' do
    user_group { build(:printer_cloud_user_group) }
    user { build(:printer_cloud_user) }
  end
end
