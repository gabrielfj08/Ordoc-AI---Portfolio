class RecycleBinSerializer < ActiveModel::Serializer
  attributes :id, :organization_id

  has_many :documents, serializer: DocumentSerializer::Base
end
