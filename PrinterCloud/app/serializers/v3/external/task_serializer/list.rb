module V3
  module External
    module TaskSerializer
      class List < Base
        attributes :procedure_info
        belongs_to :created_by

        class UserSerializer < UserSerializer::Base
        end
      end
    end
  end
end
