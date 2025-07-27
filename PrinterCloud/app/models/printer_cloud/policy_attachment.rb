module PrinterCloud
  class PolicyAttachment < ApplicationRecord
    self.table_name = 'printer_cloud.policy_attachments'

    has_one :self_ref, class_name: 'PrinterCloud::PolicyAttachment', foreign_key: :id
    has_one :user_group, source_type: 'PrinterCloud::UserGroup', through: :self_ref, source: :policy_attachable,
                         touch: true
    has_one :user, source_type: 'PrinterCloud::User', through: :self_ref, source: :policy_attachable

    belongs_to :policy, class_name: 'PrinterCloud::Policy', touch: true
    belongs_to :policy_attachable, polymorphic: true

    validates :policy, uniqueness: { scope: %i[policy_attachable_type policy_attachable_id] }
    validate :ensure_attachable_is_from_organization

    private

    def ensure_attachable_is_from_organization
      return if policy_attachable.organization_id.equal?(policy.organization_id)

      errors.add(:policy_attachable,
                 I18n.t('activerecord.errors.models.printer_cloud/policy_attachment.attributes.user_group.must_be_equal'))
    end
  end
end
