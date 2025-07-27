module Flow
  class ArchivingNote < ApplicationRecord
    include Filterable

    enum event_type: { archive: 0, unarchive: 1 }

    validates :body, :procedure_id, presence: true

    belongs_to :procedure
    belongs_to :creator, class_name: 'User', foreign_key: 'created_by_id', optional: true

    scope :filter_by_procedure_id, -> (procedure_id) { where(procedure_id: procedure_id) }
  end
end
