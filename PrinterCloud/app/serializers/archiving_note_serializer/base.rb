module ArchivingNoteSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :body, :event_type, :created_at, :updated_at

    attribute(:created_by) { object.creator.name }
  end
end
