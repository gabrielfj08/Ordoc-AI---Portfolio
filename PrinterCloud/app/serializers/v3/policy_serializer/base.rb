module V3
  module PolicySerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :prn, :effect, :resource, :service, :organization_id, :created_at, :updated_at,
                 :description, :source
    end
  end
end
