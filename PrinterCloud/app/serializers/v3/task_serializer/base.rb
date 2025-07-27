module V3
  module TaskSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :deadline, :priority, :prn, :group_assignee_id, :procedure_id, :name, :description,
                 :assignee_id, :task_template_id, :created_by_id, :status, :created_at, :updated_at
    end
  end
end
