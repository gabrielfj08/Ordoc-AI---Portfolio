module Flow
  class TaskComment < ApplicationRecord
    validates :body, :task_id, presence: true
    before_commit :task_must_be_in_review, on: [:create, :update]

    belongs_to :task
    belongs_to :creator, class_name: 'User', foreign_key: 'created_by_id', optional: true
    
    scope :filter_by_task_id,       -> (task_id) { where(task_id: task_id) }
    scope :filter_by_created_by_id, -> (user_id) { where(created_by_id: user_id) }

    private
    
    def task_must_be_in_review
      raise Error::RecordFrozenError unless task.review?
    end
  end
end
