module Flow
  class TaskVisit < ApplicationRecord
    belongs_to :user
    belongs_to :task, class_name: 'Flow::Task'
  end
end