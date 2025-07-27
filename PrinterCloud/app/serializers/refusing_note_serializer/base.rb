module RefusingNoteSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :body, :task_id, :created_by_id, :created_at
  end
end
