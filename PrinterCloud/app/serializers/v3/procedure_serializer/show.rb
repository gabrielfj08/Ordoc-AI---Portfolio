module V3
  module ProcedureSerializer
    class Show < Base
      belongs_to :requester
      belongs_to :responsible_group
      belongs_to :created_by

      attribute(:parent_procedure_template_name) do
        unless object.procedure_template.parent_procedure_template.nil?
          object.procedure_template.parent_procedure_template.name
        end
      end

      class RequesterSerializer < V3::RequesterSerializer::Base
      end

      class GroupRequesterSerializer < V3::GroupRequesterSerializer::Base
      end

      class UserSerializer < V3::UserSerializer::Base
      end
    end
  end
end
