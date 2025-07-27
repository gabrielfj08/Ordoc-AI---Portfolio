FactoryBot.define do
  factory :user_group, class: Flow::UserGroup do
    sequence(:name) { |n| "Grupo #{n}" }
    notes { 'Observações' }
    status { :active }
    organization { build(:organization) }
  end
end
