FactoryBot.define do
  factory :printer_flow_task_attachment, class: 'PrinterFlow::TaskAttachment' do
    attachable { build(:procedure_document) }
    created_by { create(:internal_requester) }
    task { build(:printer_flow_task, :started) }
  end
end
