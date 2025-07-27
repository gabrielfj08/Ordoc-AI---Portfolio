module PrinterFlow
  class TaskTemplate < ApplicationRecord
    include AASM
    include Activable
    include Searchable
    include Filterable
    include Orderable
    include Prnable

    self.per_page = 10
    self.searchable_fields = %i[name]
    self.table_name = 'printer_flow.task_templates'

    belongs_to :organization

    has_many :task_fields, as: :fieldable, class_name: 'PrinterFlow::TaskField', dependent: :destroy
    has_many :tasks, class_name: 'PrinterFlow::Task'

    before_validation :generate_prn

    validates :name, :description, presence: true
    validates :name, uniqueness: { scope: :organization_id }
    validates :name, :description, format: { without: Regex::EMOJI }

    scope :filter_by_status, lambda { |status|
                               where(status: status.map(&:to_sym) & STATUSES.keys)
                             }
    scope :search_by_name, lambda { |query|
                             where(arel_table[:name].matches("%#{query}%"))
                           }

    private

    def prn_resource_id
      "task_template/#{name}"
    end

    def procedure_count
      PrinterFlow::Procedure.joins(tasks: :task_template).where(tasks: { task_template_id: id }).uniq.count
    end
  end
end
