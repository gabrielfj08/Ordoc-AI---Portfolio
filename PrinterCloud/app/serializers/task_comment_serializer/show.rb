module TaskCommentSerializer
  class Show < Base
    belongs_to :creator

    class UserSerializer < ActiveModel::Serializer
      attributes :id, :name
    end
  end
end
