module V3
  module ThemeSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :organization_id, :image_url, :background_url, :color, :created_at,
                 :updated_at
    end
  end
end
