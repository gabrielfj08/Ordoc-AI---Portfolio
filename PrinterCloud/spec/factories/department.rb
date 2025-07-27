FactoryBot.define do
  factory :department do
    sequence(:name) { |n| "Department-#{n}" }
    description { 'Description' }
    organization { create(:organization) }
  end
end
