module V3
  module External
    module ProcedureReportSerializer
      class Show < Base
        attribute(:document_url) do
          object.document.url if object.document.present?
        end
      end
    end
  end
end
