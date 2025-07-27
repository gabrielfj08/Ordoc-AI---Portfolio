module V3
  module External
    module SharedProcedureSerializer
      class List < Base
        belongs_to :procedure
        belongs_to :external_requester
        belongs_to :created_by

        class ExternalRequesterSerializer < ExternalRequesterSerializer::Base
        end

        class ProcedureSerializer < ProcedureSerializer::Base
        end
      end
    end
  end
end
