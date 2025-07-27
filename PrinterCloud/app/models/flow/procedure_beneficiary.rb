module Flow
  class ProcedureBeneficiary < ApplicationRecord

    belongs_to :procedure,    class_name: 'Flow::Procedure'
    belongs_to :beneficiary,  class_name: 'Flow::Partaker'
  end
end
