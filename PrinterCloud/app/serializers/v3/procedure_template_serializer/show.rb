module V3
  module ProcedureTemplateSerializer
    class Show < Base
      belongs_to :group_requester

      attributes :procedures_count

      class GroupRequesterSerializer < V3::GroupRequesterSerializer::Base
      end
    end
  end
end
