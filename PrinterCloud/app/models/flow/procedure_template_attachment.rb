module Flow
  class ProcedureTemplateAttachment < ApplicationRecord
    include Filterable
    include Orderable

    validates :name, presence: true
    has_one_attached :file

    belongs_to :procedure_template

    scope :filter_by_organization_id, -> (organization_id) { joins(procedure_template: :organization).where(organization: { id: organization_id }) }
    scope :filter_by_procedure_template_id, -> (procedure_template_id) { where(procedure_template_id: procedure_template_id) }
  end
end
