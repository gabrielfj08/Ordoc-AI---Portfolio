module PrinterFlow
  class TaskField < ApplicationRecord
    include Filterable
    include Orderable
    include Searchable

    self.table_name = 'printer_flow.task_fields'
    self.searchable_fields = [:label]
    self.per_page = 10

    FIELD_TYPES = Hash(
      short_text: 0,
      long_text: 1,
      numeric: 2,
      select_field: 3,
      date: 4,
      checkbox: 5,
      phone: 6,
      email: 7,
      radio: 8,
      cpf: 9,
      cnpj: 10,
      time: 11
    )

    enum field_type: FIELD_TYPES

    validates :field_type, :label, presence: true
    validates :options, presence: true, if: :field_type_has_options?, on: :create
    validates :label, uniqueness: { scope: :fieldable }
    validates :array_values, field_type: true, if: lambda {
                                                     options.present? && fieldable_type == 'PrinterFlow::Task'
                                                   }, on: :update
    validates :value, presence: true, field_type: true, if: lambda {
                                                              options.empty? && fieldable_type == 'PrinterFlow::Task'
                                                            }, on: :update
    validates :label, :value, :array_values, format: { without: Regex::EMOJI }

    belongs_to :fieldable, polymorphic: true

    has_one :self_ref, class_name: 'PrinterFlow::TaskField', foreign_key: :id
    has_one :task_template, source: :fieldable, class_name: 'PrinterFlow::TaskTemplate', source_type: 'TaskTemplate',
                            through: :self_ref

    scope :filter_by_field_type, lambda { |field_type|
                                   where(field_type: field_type.map(&:to_sym) & FIELD_TYPES.keys)
                                 }
    scope :filter_by_task_template_id, lambda { |task_template_id|
                                         where(task_template_id: task_template_id)
                                       }
    scope :filter_by_fieldable_type, lambda { |fieldable_type|
                                       where(fieldable_type: fieldable_type)
                                     }
    scope :filter_by_fieldable_id, lambda { |fieldable_id|
                                     where(fieldable_id: fieldable_id)
                                   }
    scope :search_by_label, lambda { |query|
                              where(arel_table[:label].matches("%#{query}%"))
                            }

    def field_type_has_options?
      %w[select_field radio checkbox].include?(field_type)
    end
  end
end
