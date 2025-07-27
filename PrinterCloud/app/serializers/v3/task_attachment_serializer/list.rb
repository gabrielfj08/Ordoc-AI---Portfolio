module V3
  module TaskAttachmentSerializer
    class List < Base
      belongs_to :attachable

      class TaskDocumentSerializer < V3::TaskDocumentSerializer::Show
      end

      class ProcedureDocumentSerializer < V3::ProcedureDocumentSerializer::Show
      end
    end
  end
end
