module Flow
  class ProcedurePartaker < ApplicationRecord
    enum partaker_type: [:petitioner, :recipient]
    belongs_to :procedure, class_name: 'Flow::Procedure'
    belongs_to :partaker, class_name: 'Flow::Partaker'
  end
end
