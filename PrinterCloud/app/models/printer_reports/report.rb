module PrinterReports
  class Report < ApplicationRecord
    include Filterable
    include Orderable
    include Prnable

    before_validation :generate_prn
    validates :data, presence: true
    validates :prn, uniqueness: true

    belongs_to :organization

    scope :filter_by_name, ->(name) { where(name: name) }

    def prn_resource_id
      name
    end
  end
end
