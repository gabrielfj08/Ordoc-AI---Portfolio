module V3
  module ShareableLinkSerializer
    class List < Base
      belongs_to :created_by

      class UserSerializer < UserSerializer::Base
      end
    end
  end
end
