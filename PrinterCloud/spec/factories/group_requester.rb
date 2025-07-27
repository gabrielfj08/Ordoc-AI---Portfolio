FactoryBot.define do
  factory :group_requester, class: 'PrinterFlow::GroupRequester' do
    sequence(:name) { |n| "group-#{n}" }
    sequence(:code) { |n| n }
    type { 'PrinterFlow::GroupRequester' }
    parent_group_id { nil }
    organization { build(:organization) }
  end
end
