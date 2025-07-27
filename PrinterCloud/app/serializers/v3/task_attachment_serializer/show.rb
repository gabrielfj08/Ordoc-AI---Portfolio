module V3
  module TaskAttachmentSerializer
    class Show < Base
      belongs_to :task
      belongs_to :attachable
      belongs_to :created_by

      class TaskSerializer < V3::TaskSerializer::Base
      end

      class TaskDocumentSerializer < V3::TaskDocumentSerializer::Show
      end

      class ProcedureDocumentSerializer < V3::ProcedureDocumentSerializer::Show
      end

      class RequesterSerializer < V3::RequesterSerializer::Base
      end
    end
  end
end
