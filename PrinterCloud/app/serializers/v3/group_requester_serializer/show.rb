module V3
  module GroupRequesterSerializer
    class Show < Base
      attributes :ancestor_group_tree, :users_count
      has_many :justification_notes
      belongs_to :parent_group

      class JustificationNoteSerializer < V3::JustificationNoteSerializer::Base
      end
    end
  end
end
