module V3
  module TaskSerializer
    class Show < Base
      belongs_to :assignee
      belongs_to :group_assignee
      belongs_to :created_by
      belongs_to :procedure
      belongs_to :task_template
      has_many :task_fields

      class RequesterSerializer < V3::RequesterSerializer::Base
      end

      class ProcedureSerializer < V3::ProcedureSerializer::Base
      end

      class GroupRequesterSerializer < V3::GroupRequesterSerializer::Base
      end

      class UserSerializer < V3::UserSerializer::Base
      end

      class TaskFieldSerializer < V3::TaskFieldSerializer::Base
      end

      class TaskTemplateSerializer < V3::TaskTemplateSerializer::Base
      end
    end
  end
end
