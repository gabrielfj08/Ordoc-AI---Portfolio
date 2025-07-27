module Flow
  class RefusingNote < ApplicationRecord
    include Filterable

    validates :body, :task_id, presence: true

    belongs_to :task
    belongs_to :creator, class_name: 'User', foreign_key: 'created_by_id', optional: true

    scope :filter_by_task_id, -> (task_id) { where(task_assignment_id: task_assignment_id) }
  end
end
