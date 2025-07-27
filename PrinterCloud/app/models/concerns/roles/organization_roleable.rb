module Roles 
  module OrganizationRoleable
    extend ActiveSupport::Concern
    
    included do
      belongs_to :organization
      belongs_to :user

      validates :user_id, uniqueness: { scope: %i[organization_id type],  message: I18n.t('activerecord.errors.messages.already_added') }
    end
  end
end
