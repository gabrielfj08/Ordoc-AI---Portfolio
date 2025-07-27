module TaskAssignmentSerializer
  class Show < Base
    has_many :notes

    class TaskAssignmentNoteSerializer < ActiveModel::Serializer
      attributes :id, :user_name, :body, :created_at
    end
  end
end
