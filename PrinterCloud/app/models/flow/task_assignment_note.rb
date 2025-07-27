module Flow
  class TaskAssignmentNote < ApplicationRecord
    belongs_to :task_assignment
    validates :body, presence: :true
  end
end
