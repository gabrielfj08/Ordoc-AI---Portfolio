module V3
  module External
    module TaskSerializer
      class Show < Base
        belongs_to :assignee
        belongs_to :group_assignee
        belongs_to :procedure
        belongs_to :created_by

        class UserSerializer < UserSerializer::Base
        end

        class RequesterSerializer < V3::RequesterSerializer::Base
        end

        class ProcedureSerializer < V3::ProcedureSerializer::Base
        end

        class GroupRequesterSerializer < V3::GroupRequesterSerializer::Base
        end
      end
    end
  end
end
