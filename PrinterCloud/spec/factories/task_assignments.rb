FactoryBot.define do
  factory :task_assignment, class: 'Flow::TaskAssignment' do
    task { create(:task) }
    user { create(:user) }
    status { :created }
  end
end
