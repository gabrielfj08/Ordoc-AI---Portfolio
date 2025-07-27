module PrinterAir
  class SharedObject < ApplicationRecord
    include Filterable
    include Prnable

    self.table_name = 'printer_air.shared_objects'
    self.per_page = 10

    before_validation :generate_prn

    has_one :document, -> { where(version_id: nil) }, foreign_key: 'prn', primary_key: 'object_prn', touch: true
    has_one :directory, foreign_key: 'prn', primary_key: 'object_prn'

    belongs_to :parent_shared, foreign_key: 'parent_shared_id', class_name: 'PrinterAir::SharedObject', optional: true
    belongs_to :user, class_name: 'PrinterCloud::User'
    belongs_to :created_by, class_name: 'PrinterCloud::User'
    belongs_to :organization

    validates :object_prn, :record_type, :prn, presence: true
    validates :object_prn, uniqueness: { scope: %i[user_id parent_shared_id prn] }

    validate :can_not_share_object_with_themself
    validate :user_must_be_from_organization

    scope :filter_by_user_id, ->(user_id) { where(user_id: user_id) }
    scope :filter_by_record_type, ->(record_type) { where(record_type: record_type) }
    scope :filter_by_parent_shared_id, ->(parent_shared_id) { where(parent_shared_id: parent_shared_id) }
    scope :filter_by_root, ->(boolean) { where(parent_shared_id: nil) if boolean == 'true' }

    def resource
      document || directory
    end

    def path
      prn.gsub("prn:printer_air:#{organization.cnpj}:", '')
    end

    private

    def prn_resource_id
      if parent_shared.nil? && document.present?
        "Compartilhados/#{document.original_filename}"
      elsif parent_shared.nil? && directory.present?
        "Compartilhados/#{directory.name}/"
      elsif document.present?
        self.prn = parent_shared.prn.split(':').fourth + document.original_filename
      else
        self.prn = "#{parent_shared.prn.split(':').fourth}#{directory.name}/"
      end
    end

    def can_not_share_object_with_themself
      errors.add(:user) if user == created_by
    end

    def user_must_be_from_organization
      errors.add :user, :not_organization_member unless user.organization.eql?(organization)
    end
  end
end
