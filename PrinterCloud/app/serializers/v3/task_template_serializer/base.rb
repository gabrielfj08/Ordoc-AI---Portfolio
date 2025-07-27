module V3
  module TaskTemplateSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :description, :status, :organization_id, :prn, :created_at, :updated_at
    end
  end
end
