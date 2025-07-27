FactoryBot.define do
  factory :printer_cloud_user, class: 'PrinterCloud::User' do
    sequence(:email) { |n| "test#{n}@printerdobrasil.com.br" }
    sequence(:username) { "john.#{Faker::Alphanumeric.alpha(number: 10)}" }
    password { 'Password#123' }
    name { 'John' }
    phone { Faker::PhoneNumber.cell_phone }
    cpf { CPF.generate }
    date_of_birth { '2021-01-15' }
    confirmed_at { Time.now }
    status { 'active' }
    organization { build(:organization) }

    trait :admin do
      admin { true }
    end

    trait :with_policy_for_policies do
      after(:create) do |printer_cloud_user|
        printer_cloud_user.policies << [create(:policy, :with_policy_actions,
                                               organization: printer_cloud_user.organization)]
      end
    end

    trait :with_policies do
      after(:create) do |printer_cloud_user|
        printer_cloud_user.policies << [create(:policy, :with_procedure_template_actions,
                                               organization: printer_cloud_user.organization),
                                        create(:policy, :with_requester_actions,
                                               organization: printer_cloud_user.organization),
                                        create(:policy, :with_task_template_actions,
                                               organization: printer_cloud_user.organization),
                                        create(:policy, :with_document_and_directory_actions,
                                               organization: printer_cloud_user.organization),
                                        create(:policy, :with_organization_actions,
                                               organization: printer_cloud_user.organization),
                                        create(:policy, :with_user_group_actions,
                                               organization: printer_cloud_user.organization),
                                        create(:policy, :with_report_actions,
                                               organization: printer_cloud_user.organization),
                                        create(:policy, :with_user_actions,
                                               organization: printer_cloud_user.organization)]
      end
    end
  end
end
