FactoryBot.define do
  factory :printer_flow_task, class: 'PrinterFlow::Task' do
    traits_for_enum :status, %i[draft running started finished]

    status { :draft }
    priority { :normal }
    name { 'Assinar o documento' }
    description { 'Assine o documento' }
    procedure { create(:printer_flow_procedure, organization: created_by.organization) }
    created_by { build(:printer_cloud_user) }
    task_template { build(:task_template) }
  end
end
