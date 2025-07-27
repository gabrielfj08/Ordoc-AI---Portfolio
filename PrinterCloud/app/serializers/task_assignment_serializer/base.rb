module TaskAssignmentSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :task_id, :user_id, :user_group_id, :status, :created_at, :updated_at
  end
end
