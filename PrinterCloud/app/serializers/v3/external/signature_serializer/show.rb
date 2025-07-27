module V3
  module External
    module SignatureSerializer
      class Show < Base
        belongs_to :signable

        class TaskDocumentSerializer < V3::External::TaskDocumentSerializer::Show
        end

        class ProcedureDocumentSerializer < V3::External::ProcedureDocumentSerializer::Show
        end
      end
    end
  end
end
