FactoryBot.define do
  factory :policy_action, class: 'PrinterCloud::PolicyAction' do
    access_level { 'write' }
    action { 'update' }
    service { 'printer_cloud' }
    label { 'Editar grupo' }

    trait :user_group do
      resource { 'user_group' }
      service { 'printer_cloud' }
    end

    trait :organization do
      resource { 'organization' }
      service { 'printer_cloud' }
    end

    trait :policy do
      resource { 'policy' }
      service { 'printer_cloud' }
    end

    trait :user do
      resource { 'user' }
      service { 'printer_cloud' }
    end

    trait :directory do
      resource { 'directory' }
      service { 'printer_air' }
    end

    trait :document do
      resource { 'document' }
      service { 'printer_air' }
    end

    trait :requester do
      resource { 'requester' }
      service { 'printer_flow' }
    end

    trait :procedure_template do
      resource { 'procedure_template' }
      service { 'printer_flow' }
    end

    trait :task_template do
      resource { 'task_template' }
      service { 'printer_flow' }
    end

    trait :report do
      resource { 'report' }
      service { 'printer_reports' }
    end
  end
end
