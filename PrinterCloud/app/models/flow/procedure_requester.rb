module Flow
  class ProcedureRequester < ApplicationRecord

    belongs_to :procedure, class_name: 'Flow::Procedure'
    belongs_to :requester, class_name: 'Flow::Partaker'
  end
end
