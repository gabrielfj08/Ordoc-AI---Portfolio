module V3
  module External
    module TaskDocumentSerializer
      class Show < Base
        belongs_to :created_by
        attribute(:document_url)

        class UserSerializer < V3::UserSerializer::Base
        end
      end
    end
  end
end
