module PrinterCloud
  class UserGroup < ApplicationRecord
    include AASM
    include Activable
    include Filterable
    include Orderable
    include Searchable
    include Prnable

    self.table_name = 'printer_cloud.user_groups'
    self.searchable_fields = [:name]

    before_validation :generate_prn

    belongs_to :organization
    has_many :user_group_assignments, class_name: 'PrinterCloud::UserGroupAssignment', dependent: :destroy
    has_many :users, class_name: 'PrinterCloud::User', through: :user_group_assignments, source: :user
    has_many :policy_attachments, as: :policy_attachable, class_name: 'PrinterCloud::PolicyAttachment'
    has_many :policies, through: :policy_attachments

    validates :prn, uniqueness: true
    validates :name, :prn, :status, :description, presence: true
    validates :name, uniqueness: { scope: :organization_id }
    validates :name, format: { with: Regex::NON_ASTERISK, multiline: true }, on: %i[create update]
    validates :description, length: { maximum: 255 }
    validate :ensure_group_is_active, on: :update, unless: -> { status_changed? }

    scope :search_by_name, ->(query) { where(arel_table[:name].matches("%#{query}%")) }

    scope :filter_by_organization_id, ->(organization_id) { where(organization_id: organization_id) }
    scope :filter_by_policy_id, lambda { |policy_id|
                                  joins(:policy_attachments).where(policy_attachments: { policy_id: policy_id })
                                }
    scope :filter_by_status, ->(status) { where(status: status.map(&:to_sym) & Activable::STATUSES.keys) }
    scope :filter_by_user_id, lambda { |user_id|
                                joins(:user_group_assignments).where(user_group_assignments: { user_id: user_id })
                              }

    def users_count
      users.kept.count
    end

    def policies_count
      policies.count
    end

    private

    def prn_resource_id
      "#{self.class.to_s.demodulize.underscore}/#{name}"
    end

    def ensure_group_is_active
      errors.add(:user_group, I18n.t('printer_cloud.errors.messages.user_group_is_inactive')) if inactive?
    end
  end
end
