FactoryBot.define do
  factory :role do
    type { Roles::ADMIN }
    user { build(:user) }

    trait :organization_manager do
      type { Roles::ORGANIZATION_MANAGER }
      organization { build(:organization) }
    end

    trait :organization_member do
      type { Roles::ORGANIZATION_MEMBER }
      organization { build(:organization) }
    end

    trait :department_member do
      type { Roles::DEPARTMENT_MEMBER }
      department { build(:department) }
    end

    trait :admin do
      type { Roles::ADMIN }
    end
  end
end
