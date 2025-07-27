module PrinterFlow
  class ProcedureTemplate < ApplicationRecord
    include AASM
    include Prnable
    include Searchable
    include Filterable
    include Orderable

    STATUSES = Hash(
      inactive: -1,
      active: 0
    )

    enum status: STATUSES
    aasm column: :status, enum: true, skip_validation_on_save: true do
      state :active, initial: true
      state :inactive

      event :activate do
        transitions from: :inactive, to: :active
      end

      event :deactivate do
        transitions from: :active, to: :inactive
      end
    end

    self.per_page = 10
    self.searchable_fields = %i[name]
    self.table_name = 'printer_flow.procedure_templates'

    SOURCES = Hash(
      internal: 0,
      external: 1,
      internal_external: 2
    )

    enum source: SOURCES

    before_validation :generate_prn

    belongs_to :group_requester, class_name: 'PrinterFlow::GroupRequester', optional: true
    belongs_to :organization
    belongs_to :parent_procedure_template, class_name: 'PrinterFlow::ProcedureTemplate',
                                           foreign_key: 'parent_procedure_template_id', optional: true, touch: true

    has_many :children_procedure_templates, class_name: 'PrinterFlow::ProcedureTemplate', foreign_key: 'parent_procedure_template_id',
                                            inverse_of: :parent_procedure_template, dependent: :destroy
    has_many :fields, class_name: 'PrinterFlow::Field', dependent: :destroy
    has_many :procedure_template_documents, class_name: 'PrinterFlow::ProcedureTemplateDocument',
                                            foreign_key: 'procedure_template_id'
    has_many :procedures, class_name: 'PrinterFlow::Procedure'

    alias procedure_templates children_procedure_templates

    validates :name, :source, :prn, presence: true
    validates :prn, uniqueness: { scope: :parent_procedure_template_id }
    validates :group_requester_id, presence: true, if: :has_parent_procedure_template_and_is_external?
    validates :name, format: { without: Regex::EMOJI }

    validate :ensure_procedure_template_has_not_children_procedure_templates, on: :update

    before_commit :ensure_procedure_template_is_active, on: :update

    scope :filter_by_root, ->(boolean) { where(parent_procedure_template_id: nil) if boolean == 'true' }
    scope :filter_by_parent_procedure_template_id, lambda { |parent_procedure_template_id|
                                                     where(parent_procedure_template_id: parent_procedure_template_id)
                                                   }

    scope :filter_by_source, lambda { |source|
                               where(source: source.map(&:to_sym) & SOURCES.keys)
                             }
    scope :filter_by_status, lambda { |status|
                               where(status: status.map(&:to_sym) & STATUSES.keys)
                             }
    scope :search_by_name, lambda { |query|
                             where(arel_table[:name].matches("%#{query}%"))
                           }

    def children_count
      procedure_templates.count
    end

    def procedures_count
      procedures.count
    end

    private

    def ensure_procedure_template_is_active
      raise Error::PrinterFlow::CannotUpdateProcedureTemplate if inactive?
    end

    def has_parent_procedure_template_and_is_external?
      parent_procedure_template.present? && (source == 'external' || source == 'internal_external')
    end

    def prn_resource_id
      if parent_procedure_template.present?
        "procedure_template/#{parent_procedure_template.name}/#{name}"
      else
        "procedure_template/#{name}"
      end
    end

    def ensure_procedure_template_has_not_children_procedure_templates
      return unless children_procedure_templates.present? && source_change.present?

      raise Error::PrinterFlow::CannotUpdateProcedureTemplateSource
    end
  end
end
