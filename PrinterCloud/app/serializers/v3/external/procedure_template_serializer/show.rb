module V3
  module External
    module ProcedureTemplateSerializer
      class Show < Base
        belongs_to :group_requester

        class GroupRequesterSerializer < V3::GroupRequesterSerializer::Base
        end
      end
    end
  end
end
