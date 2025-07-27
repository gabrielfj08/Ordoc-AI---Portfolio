FactoryBot.define do
  factory :requester_info, class: 'PrinterFlow::RequesterInfo' do
    procedures_count { 1 }
    requester_id { 1 }
    created_by { create(:printer_cloud_user) }
  end
end
