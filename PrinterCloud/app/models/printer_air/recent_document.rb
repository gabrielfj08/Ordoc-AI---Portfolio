module PrinterAir
  class RecentDocument < ApplicationRecord
    include Filterable
    include Orderable

    before_validation :set_last_accessed_at

    self.table_name = 'printer_air.recent_documents'

    validates :document_id, uniqueness: { scope: :user_id }

    belongs_to :document, class_name: 'PrinterAir::Document'
    belongs_to :user, class_name: 'PrinterCloud::User'

    scope :filter_by_organization_id, lambda { |organization_id|
                                        joins(document: :directory).where(directory: { organization_id: organization_id })
                                      }
    scope :filter_by_prn, ->(prn) { joins(:document).where('documents.prn ilike ?', "#{prn}%") }
    scope :filter_by_user_id, ->(user_id) { where(user_id: user_id) }

    private

    def set_last_accessed_at
      self.last_accessed_at = Time.now
    end
  end
end
