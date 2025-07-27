module V3
  module ProcedureReportSerializer
    class Show < Base
      attribute(:document_url) do
        object.document.url if object.document.present?
      end

      belongs_to :procedure
      belongs_to :created_by
      class RequesterSerializer < V3::RequesterSerializer::Base
      end

      class ProcedureSerializer < V3::ProcedureSerializer::Base
      end
    end
  end
end
