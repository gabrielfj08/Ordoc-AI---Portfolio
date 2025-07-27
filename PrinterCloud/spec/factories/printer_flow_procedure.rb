FactoryBot.define do
  factory :printer_flow_procedure, class: 'PrinterFlow::Procedure' do
    traits_for_enum :source, %i[internal external]
    traits_for_enum :status, %i[draft running archived finished]

    status { :draft }
    deadline { '01/01/3000' }
    priority { :normal }
    payload { [] }
    schema { [] }
    organization { created_by.organization }
    procedure_template { build(:printer_flow_procedure_template, :child_template, organization: organization) }
    responsible_group { build(:group_requester, organization: organization) }
    requester { create(:internal_requester) }
    created_by { build(:printer_cloud_user) }

    trait :with_attachment_field do
      schema { [{ 'label' => 'Anexo', 'field_type' => 'attachment' }] }
    end

    trait :with_finished_task do
      after(:create) do |procedure|
        task = create(:printer_flow_task, :started, procedure: procedure)
        create(:task_comment, task: task, created_by: create(:internal_requester))
        task.finish!
      end
    end

    trait :private do
      after(:build) do |procedure|
        procedure.private = true
      end
    end

    trait :public do
      after(:build) do |procedure|
        procedure.private = false
      end
    end
  end
end
