module V3
  module External
    module JustificationNoteSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :note, :created_by_id, :action, :justifiable_type, :justifiable_id, :created_at, :updated_at
      end
    end
  end
end
