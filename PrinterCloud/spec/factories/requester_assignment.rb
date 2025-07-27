FactoryBot.define do
  factory :requester_assignment, class: 'PrinterFlow::RequesterAssignment' do
    user { build(:printer_cloud_user) }
    requester { build(:requester) }
  end
end
