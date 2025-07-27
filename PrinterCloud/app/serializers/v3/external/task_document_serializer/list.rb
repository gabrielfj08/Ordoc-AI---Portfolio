module V3
  module External
    module TaskDocumentSerializer
      class List < Base
        belongs_to :created_by

        class UserSerializer < V3::UserSerializer::Base
        end
      end
    end
  end
end
