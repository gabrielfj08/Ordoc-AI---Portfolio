FactoryBot.define do
  factory :group_requester_info, class: 'PrinterFlow::GroupRequesterInfo' do
    procedures_count { 1 }
    group_requester
    created_by { create(:printer_cloud_user) }
  end
end
