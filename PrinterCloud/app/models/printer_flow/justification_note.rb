module PrinterFlow
  class JustificationNote < ApplicationRecord
    include Orderable
    include Filterable

    self.table_name = 'printer_flow.justification_notes'
    self.per_page = 10

    validates :note, presence: true
    validates :note, format: { without: Regex::EMOJI }

    belongs_to :created_by, class_name: 'PrinterFlow::Requester'
    belongs_to :justifiable, polymorphic: true

    scope :filter_by_justifiable_type, ->(justifiable_type) { where(justifiable_type: justifiable_type) }
    scope :filter_by_justifiable_id, ->(justifiable_id) { where(justifiable_id: justifiable_id) }
  end
end
