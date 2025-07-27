module V3
  module PolicySerializer
    class Show < Base
      has_many :actions
      belongs_to :organization
      attributes :users_count, :user_groups_count

      class OrganizationSerializer < ActiveModel::Serializer
        attributes :corporate_name, :cnpj
      end

      class PolicyActionSerializer < ActiveModel::Serializer
        attributes :id, :service, :access_level, :resource, :action, :label
        attribute(:translated_resource) { I18n.t("printer_cloud.actions.resources.#{object.resource}") }
      end
    end
  end
end
