FactoryBot.define do
  factory :permission do
    scope { 1 }
    directory { nil }
    document { nil }
    permission_granted_by { nil }
    user { nil }
  end
end
