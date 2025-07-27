module Flow
  class ProcedureInterested < ApplicationRecord
    belongs_to :user
    belongs_to :procedure, class_name: 'Flow::Procedure'
    enum interested_type: [:editor, :reader]
  end
end
