module V3
  module External
    module ProcedureSerializer
      class Show < Base
        belongs_to :requester
        belongs_to :responsible_group

        attribute(:parent_procedure_template_name) do
          unless object.procedure_template.parent_procedure_template.nil?
            object.procedure_template.parent_procedure_template.name
          end
        end

        class ExternalRequesterSerializer < V3::External::ExternalRequesterSerializer::Base
        end

        class GroupRequesterSerializer < V3::GroupRequesterSerializer::Base
        end
      end
    end
  end
end
