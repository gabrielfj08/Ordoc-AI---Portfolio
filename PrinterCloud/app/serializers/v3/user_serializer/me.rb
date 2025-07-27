module V3
  module UserSerializer
    class Me < Base
      has_one :internal_requester

      class RequesterSerializer < V3::RequesterSerializer::Base
      end
    end
  end
end
