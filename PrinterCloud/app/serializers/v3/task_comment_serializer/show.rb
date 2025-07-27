module V3
  module TaskCommentSerializer
    class Show < Base
      belongs_to :created_by
      belongs_to :task

      class TaskSerializer < V3::TaskSerializer::Base
      end

      class RequesterSerializer < V3::RequesterSerializer::Base
      end
    end
  end
end
