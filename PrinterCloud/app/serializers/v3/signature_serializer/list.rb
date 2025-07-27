module V3
  module SignatureSerializer
    class List < Base
      belongs_to :procedure
      belongs_to :requester
      belongs_to :created_by

      has_one :signable

      class RequesterSerializer < RequesterSerializer::Base
      end

      class UserSerializer < UserSerializer::Base
      end

      class ProcedureSerializer < ProcedureSerializer::Base
      end

      class TaskDocumentSerializer < TaskDocumentSerializer::Show
      end

      class ProcedureDocumentSerializer < ProcedureDocumentSerializer::Show
      end
    end
  end
end
