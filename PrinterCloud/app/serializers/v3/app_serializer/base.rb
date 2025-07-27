module V3
  module AppSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :description, :prn, :service, :created_at, :updated_at
    end
  end
end
