module V3
  module External
    module FieldSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :label, :procedure_template_id, :field_type, :required, :created_at, :updated_at
      end
    end
  end
end
