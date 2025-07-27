module Flow
  class ProcedureTemplate < ApplicationRecord
    include AASM
    include Activable
    include Discard::Model
    include Filterable
    include Orderable
    include Searchable

    self.discard_column = :deleted_at
    self.searchable_fields = [:name]

    has_many :procedures
    has_many :attachments, class_name: 'Flow::ProcedureTemplateAttachment', dependent: :destroy

    belongs_to :organization
    validates :name, :description, presence: true

    scope :filter_by_organization_id,         -> (organization_id) { where(organization_id: organization_id) }
    scope :filter_by_statuses,                -> (statuses) { where(status: statuses.map(&:to_sym) & Activable::STATUSES.keys) }
    scope :search_by_name,                    -> (name)   { where(Flow::ProcedureTemplate.arel_table[:name].matches("%#{name}%")) }

    private

    def is_not_referenced_in_any_procedure?
      self.procedures.count == 0
    end
  end
end
