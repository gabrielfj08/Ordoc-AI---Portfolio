FactoryBot.define do
  factory :policy, class: 'PrinterCloud::Policy' do
    sequence(:name) { |n| "policy-#{n}" }
    effect { 'allow' }
    organization
    description { 'description' }
    source { 'customer_managed' }
    service { 'printer_cloud' }
    resource { ["prn:printer_cloud:#{organization.cnpj}:*"] }

    trait :with_user_group_actions do
      resource { ["prn:printer_cloud:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :user_group, action: :list)
        policy.actions << (create :policy_action, :user_group, action: :read)
        policy.actions << (create :policy_action, :user_group, action: :create)
        policy.actions << (create :policy_action, :user_group, action: :update)
        policy.actions << (create :policy_action, :user_group, action: :delete)
        policy.actions << (create :policy_action, :user_group, action: :attach_user_to_group)
        policy.actions << (create :policy_action, :user_group, action: :detach_user_from_group)
        policy.actions << (create :policy_action, :user_group, action: :attach_policy_to_group)
        policy.actions << (create :policy_action, :user_group, action: :detach_policy_from_group)
      end
    end

    trait :with_organization_actions do
      resource { ["prn:printer_cloud:#{organization.cnpj}"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :organization, action: :update)
      end
    end

    trait :with_policy_actions do
      resource { ["prn:printer_cloud:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :policy, action: :list)
        policy.actions << (create :policy_action, :policy, action: :read)
        policy.actions << (create :policy_action, :policy, action: :create)
        policy.actions << (create :policy_action, :policy, action: :update)
        policy.actions << (create :policy_action, :policy, action: :delete)
        policy.actions << (create :policy_action, :user_group, action: :attach_policy_to_group)
        policy.actions << (create :policy_action, :user, action: :attach_policy_to_user)
      end
    end

    trait :with_user_actions do
      resource { ["prn:printer_cloud:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :user, action: :attach_policy_to_user)
        policy.actions << (create :policy_action, :user, action: :detach_policy_from_user)
        policy.actions << (create :policy_action, :user, action: :delete)
        policy.actions << (create :policy_action, :user, action: :create)
        policy.actions << (create :policy_action, :user, action: :update)
        policy.actions << (create :policy_action, :user, action: :read)
        policy.actions << (create :policy_action, :user, action: :list)
      end
    end

    trait :with_directory_actions do
      resource { ["prn:printer_air:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :directory, action: :list)
        policy.actions << (create :policy_action, :directory, action: :read)
        policy.actions << (create :policy_action, :directory, action: :create)
        policy.actions << (create :policy_action, :directory, action: :delete)
        policy.actions << (create :policy_action, :directory, action: :update)
        policy.actions << (create :policy_action, :directory, action: :share)
        policy.actions << (create :policy_action, :directory, action: :restore)
      end
    end

    trait :with_document_actions do
      resource { ["prn:printer_air:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :document, action: :list)
        policy.actions << (create :policy_action, :document, action: :read)
        policy.actions << (create :policy_action, :document, action: :create)
        policy.actions << (create :policy_action, :document, action: :delete)
        policy.actions << (create :policy_action, :document, action: :update)
        policy.actions << (create :policy_action, :document, action: :share)
        policy.actions << (create :policy_action, :document, action: :restore)
      end
    end

    trait :with_document_and_directory_actions do
      resource { ["prn:printer_air:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :directory, action: :list)
        policy.actions << (create :policy_action, :directory, action: :read)
        policy.actions << (create :policy_action, :directory, action: :update)
        policy.actions << (create :policy_action, :directory, action: :create)
        policy.actions << (create :policy_action, :directory, action: :delete)
        policy.actions << (create :policy_action, :directory, action: :share)
        policy.actions << (create :policy_action, :directory, action: :restore)

        policy.actions << (create :policy_action, :document, action: :list)
        policy.actions << (create :policy_action, :document, action: :read)
        policy.actions << (create :policy_action, :document, action: :update)
        policy.actions << (create :policy_action, :document, action: :create)
        policy.actions << (create :policy_action, :document, action: :delete)
        policy.actions << (create :policy_action, :document, action: :share)
        policy.actions << (create :policy_action, :document, action: :restore)
      end
    end

    trait :with_requester_actions do
      resource { ["prn:printer_flow:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :requester, action: :list)
        policy.actions << (create :policy_action, :requester, action: :read)
        policy.actions << (create :policy_action, :requester, action: :update)
        policy.actions << (create :policy_action, :requester, action: :create)
        policy.actions << (create :policy_action, :requester, action: :add_requester_to_group)
        policy.actions << (create :policy_action, :requester, action: :remove_requester_from_group)
      end
    end

    trait :with_procedure_template_actions do
      resource { ["prn:printer_flow:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :procedure_template, action: :list)
        policy.actions << (create :policy_action, :procedure_template, action: :read)
        policy.actions << (create :policy_action, :procedure_template, action: :update)
        policy.actions << (create :policy_action, :procedure_template, action: :create)
      end
    end

    trait :with_task_template_actions do
      resource { ["prn:printer_flow:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :task_template, action: :list)
        policy.actions << (create :policy_action, :task_template, action: :read)
        policy.actions << (create :policy_action, :task_template, action: :update)
        policy.actions << (create :policy_action, :task_template, action: :create)
      end
    end

    trait :with_report_actions do
      resource { ["prn:printer_reports:#{organization.cnpj}:*"] }

      after :create do |policy|
        policy.actions << (create :policy_action, :report, action: :list)
      end
    end
  end
end
