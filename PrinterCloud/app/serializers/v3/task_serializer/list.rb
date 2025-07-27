module V3
  module TaskSerializer
    class List < Base
      attributes :procedure_info
      belongs_to :assignee
      belongs_to :group_assignee
      belongs_to :procedure

      class ProcedureSerializer < V3::ProcedureSerializer::Base
      end

      class RequesterSerializer < V3::RequesterSerializer::Base
      end

      class GroupRequesterSerializer < V3::GroupRequesterSerializer::Base
      end
    end
  end
end
