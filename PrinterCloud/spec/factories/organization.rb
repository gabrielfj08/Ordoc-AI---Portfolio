FactoryBot.define do
  factory :organization do
    sequence(:corporate_name) { |n| "organization-#{n}" }
    email { 'contact@example.com' }
    phone { '5541999999999' }
    cnpj { CNPJ.generate }
    site { 'www.fluxo.pro' }
    contact_name { 'some contact' }
    contact_phone { '5541999999999' }
    sequence(:subdomain) { |n| "organization-#{n}" }

    trait :with_recycle_bin do
      after :create do |org|
        create :recycle_bin, organization: org
      end
    end

    trait :with_reports do
      after :create do |organization|
        organization.create_default_reports
      end
    end

    trait :with_root_directory do
      after :create do |organization|
        organization.root_directory = create(:printer_air_directory, name: 'Meu Air', organization: organization)
      end
    end
  end
end
