module V3
  module SignatureSerializer
    class Show < Base
      belongs_to :requester
      belongs_to :signable

      class RequesterSerializer < V3::RequesterSerializer::Base
      end

      class TaskDocumentSerializer < V3::TaskDocumentSerializer::Show
      end

      class ProcedureDocumentSerializer < V3::ProcedureDocumentSerializer::Show
      end
    end
  end
end
