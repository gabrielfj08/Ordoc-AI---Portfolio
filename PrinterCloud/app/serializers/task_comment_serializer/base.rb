module TaskCommentSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :body, :created_at, :updated_at
  end
end
