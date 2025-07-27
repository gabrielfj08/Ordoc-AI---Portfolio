module PrinterCloud
  class Decree < ApplicationRecord
    include Orderable

    self.table_name = 'printer_cloud.decrees'

    belongs_to :organization

    validates :organization_id, uniqueness: true
    validates :decree_number, :decree_date, :decree_url, presence: true
    validates :decree_date, comparison: { less_than_or_equal_to: Date.today }, if: -> { decree_date_changed? }
    validates :law_date, comparison: { less_than_or_equal_to: Date.today }, if: lambda {
                                                                                  law_date_changed? && law_date.present?
                                                                                }
    validates :body, length: { maximum: 450 }
  end
end
