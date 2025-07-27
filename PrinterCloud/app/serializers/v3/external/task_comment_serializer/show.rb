module V3
  module External
    module TaskCommentSerializer
      class Show < Base
        belongs_to :created_by

        class RequesterSerializer < V3::RequesterSerializer::Base
        end
      end
    end
  end
end
