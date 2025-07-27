class AttachableDocumentSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :status, :deleted_at
end
