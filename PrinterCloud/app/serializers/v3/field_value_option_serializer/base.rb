module V3
  module FieldValueOptionSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :field_id, :value, :created_at, :updated_at
    end
  end
end
