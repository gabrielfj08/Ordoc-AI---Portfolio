module V3
  module PolicyActionSerializer
    class Base < ActiveModel::Serializer
      attributes :id, :access_level, :service, :resource, :action, :label, :created_at, :updated_at
      attribute(:translated_resource) { I18n.t("printer_cloud.actions.resources.#{object.resource}") }
    end
  end
end
