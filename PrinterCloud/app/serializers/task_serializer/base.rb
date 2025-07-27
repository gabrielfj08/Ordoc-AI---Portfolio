module TaskSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :description, :name, :procedure_id, :status, :created_at, :updated_at, :archived_at
  end
end

