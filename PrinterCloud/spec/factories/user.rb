FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@printerdobrasil.com.br" }
    password { 'Password#123' }
    name { 'John' }
    username { '' }
    phone { Faker::PhoneNumber.cell_phone }
    cpf { CPF.generate }
    date_of_birth { '2021-01-15' }
    confirmed_at { Time.now }
    status { 'active' }

    after(:create) do |user|
      create(:inbox, user: user)
    end

    trait :admin do
      after(:create) do |user|
        create(:role, :admin, user: user)
      end
    end

    trait :organization_manager do
      after(:create) do |user|
        organization = create(:organization)
        create(:role, :organization_manager, user: user, organization: organization)
      end
    end
  end
end
