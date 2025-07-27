module V3
  module GroupRequesterSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :name, :parent_group_id, :prn, :code, :status, :created_at, :updated_at
    end
  end
end
