module V3
  module External
    module TaskCommentSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :body, :task_id, :created_by_id, :created_at,
                   :updated_at
      end
    end
  end
end
