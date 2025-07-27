module V3
  module External
    module JustificationNoteSerializer
      class List < Base
        belongs_to :created_by

        class RequesterSerializer < V3::RequesterSerializer::Base
        end
      end
    end
  end
end
