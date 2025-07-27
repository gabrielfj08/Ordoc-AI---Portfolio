module PrinterCloud
  class Policy < ApplicationRecord
    include Filterable
    include Orderable
    include Searchable
    include Prnable

    self.table_name = 'printer_cloud.policies'
    self.searchable_fields = [:name]

    EFFECTS = Hash(
      allow: 0,
      deny: -1
    )

    SOURCES = Hash(
      customer_managed: 0,
      printer_cloud_managed: 1
    )

    SERVICES = Hash(
      printer_cloud: 0,
      printer_air: 1,
      printer_flow: 2,
      printer_reports: 3
    )

    enum effect: EFFECTS
    enum source: SOURCES
    enum service: SERVICES

    before_validation :generate_prn

    validates :prn, uniqueness: true
    validates :name, :prn, :effect, :description, :source, :service, :resource, presence: true
    validates :name, format: { with: Regex::NON_ASTERISK,  multiline: true }, on: %i[create update]
    validates :description, length: { maximum: 255 }
    validate :resource_must_belongs_to_organization

    before_destroy :ensure_policy_can_be_destroyed

    belongs_to :organization
    has_many :policy_attachments, class_name: 'PrinterCloud::PolicyAttachment', dependent: :destroy
    has_many :users, through: :policy_attachments, source: :policy_attachable,
                     source_type: 'PrinterCloud::User'
    has_many :user_groups, through: :policy_attachments, source: :policy_attachable,
                           source_type: 'PrinterCloud::UserGroup'
    has_many :policy_action_assignments, class_name: 'PrinterCloud::PolicyActionAssignment', dependent: :destroy
    has_many :actions, through: :policy_action_assignments, source: 'policy_action'

    scope :filter_by_organization_id, ->(organization_id) { where(organization_id: organization_id) }
    scope :filter_by_user_group_id, lambda { |user_group_id|
                                      joins(:policy_attachments).where(policy_attachments:
                                      { policy_attachable_type: 'PrinterCloud::UserGroup',
                                        policy_attachable_id: user_group_id })
                                    }
    scope :filter_by_user_id, lambda { |user_id|
                                joins(:policy_attachments).where(policy_attachments:
                                { policy_attachable_type: 'PrinterCloud::User',
                                  policy_attachable_id: user_id })
                              }
    scope :filter_by_source, ->(source) { where(source: source.map(&:to_sym) & SOURCES.keys) }
    scope :filter_by_action, ->(action) { joins(:actions).where(actions: { action: action }) }
    scope :filter_by_action_resource, ->(resource) { joins(:actions).where(actions: { resource: resource }) }
    scope :filter_by_public, lambda { |boolean|
                               where.not(effect: :deny, source: 'printer_cloud_managed') if boolean == 'true'
                             }

    scope :active, -> { joins(:organization).where(organization: { status: :active }) }

    scope :search_by_name, ->(query) { where(arel_table[:name].matches("%#{query}%")) }

    def users_count
      users.kept.count
    end

    def user_groups_count
      user_groups.count
    end

    private

    def ensure_policy_can_be_destroyed
      return unless printer_cloud_managed? && deny?

      raise ::Error::PrinterCloud::CanNotDeletePolicy
    end

    def prn_resource_id
      "#{self.class.to_s.demodulize.underscore}/#{name}"
    end

    def resource_must_belongs_to_organization
      resource.each do |prn|
        if Prn.new(resource_prn: prn).organization_cnpj != organization.cnpj
          errors.add(:resource,
                     I18n.t('activerecord.errors.messages.must_be_at_the_same_organization'))
        end
      end
    end
  end
end
