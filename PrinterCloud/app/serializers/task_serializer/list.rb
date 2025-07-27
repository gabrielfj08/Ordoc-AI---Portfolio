module TaskSerializer
  class List < Base
    belongs_to :procedure
    has_one :assignee
    has_one :group_assignee
    has_one :refusing_note

    class UserSerializer < ActiveModel::Serializer
      attributes :id, :name, :email
    end

    class UserGroupSerializer < ActiveModel::Serializer
      attributes :id, :name
    end

    class ProcedureSerializer < ActiveModel::Serializer
      attributes :internal_process_number, :department_id
    end

    class RefusingNoteSerializer < ActiveModel::Serializer
      attributes :id, :body, :created_by_id, :created_at
    end
  end
end
