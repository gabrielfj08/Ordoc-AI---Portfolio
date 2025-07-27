module PrinterCloud
  class UserGroupAssignment < ApplicationRecord
    self.table_name = 'printer_cloud.user_group_assignments'

    validates :user, uniqueness: { scope: :user_group_id }
    validate :ensure_user_is_from_organization

    belongs_to :user, class_name: 'PrinterCloud::User', foreign_key: 'user_id'
    belongs_to :user_group, class_name: 'PrinterCloud::UserGroup', foreign_key: 'user_group_id'

    private

    def ensure_user_is_from_organization
      return if user.organization.eql?(user_group.organization)

      errors.add(:user,
                 I18n.t('activerecord.errors.models.printer_cloud/user_group.attributes.user.must_be_added_in_organization'))
    end
  end
end
