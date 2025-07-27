FactoryBot.define do
  factory :task_comment, class: 'PrinterFlow::TaskComment' do
    body { 'Assinar o documento com caneta azul' }
    task { build(:printer_flow_task) }
  end
end
