module V3
  module TaskFieldSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :label, :fieldable_type, :fieldable_id, :field_type, :options, :value,
                 :array_values, :created_at, :updated_at
    end
  end
end
