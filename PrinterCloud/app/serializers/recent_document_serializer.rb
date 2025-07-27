class RecentDocumentSerializer < ActiveModel::Serializer
    attributes :updated_at
    has_one :document, serializer: DocumentSerializer::Base
end