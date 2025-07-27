module PrinterFlow
  class Field < ApplicationRecord
    include Orderable
    include Filterable
    include Searchable

    self.searchable_fields = [:label]
    self.table_name = 'printer_flow.fields'
    self.per_page = 10

    FIELD_TYPES = Hash(
      short_text: 0,
      long_text: 1,
      numeric: 2,
      select_field: 3,
      date: 4,
      attachment: 5,
      checkbox: 6,
      phone: 7,
      email: 8,
      radio: 9,
      cpf: 10,
      cnpj: 11,
      time: 12
    )

    enum field_type: FIELD_TYPES

    validates :field_type, :label, :required, presence: true
    validates :label, format: { without: Regex::EMOJI }

    belongs_to :procedure_template, class_name: 'PrinterFlow::ProcedureTemplate', touch: true

    has_many :field_value_options, class_name: 'PrinterFlow::FieldValueOption', dependent: :destroy

    has_one :field_attachment, class_name: 'PrinterFlow::FieldAttachment', touch: true, dependent: :destroy
    has_one :field_document_template, class_name: 'PrinterFlow::FieldDocumentTemplate', through: :field_attachment

    scope :filter_by_field_type, ->(field_type) { where(field_type: field_type.map(&:to_sym) & FIELD_TYPES.keys) }
    scope :selectable, -> { where(field_type: %w[radio checkbox select_field]) }
    scope :search_by_label, lambda { |query|
                              where(arel_table[:label].matches("%#{query}%"))
                            }
  end
end
