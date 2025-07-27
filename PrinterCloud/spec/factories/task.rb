FactoryBot.define do
  factory :task, class: Flow::Task do
    procedure { create(:procedure) }
    name { 'Isso é uma task' }
    description { 'Isso é uma task' }
  end
end
