FactoryBot.define do
  factory :task_field, class: 'PrinterFlow::TaskField' do
    field_type { :short_text }
    label { 'Nome' }
  end
end
