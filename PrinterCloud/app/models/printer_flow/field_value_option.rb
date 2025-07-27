module PrinterFlow
  class FieldValueOption < ApplicationRecord
    include ActiveModel::Validations

    validates_with FieldValidator, attributes: [:field]
    self.table_name = 'printer_flow.field_value_options'

    belongs_to :field, class_name: 'PrinterFlow::Field'
    has_one :procedure_template, through: :field, class_name: 'PrinterFlow::ProcedureTemplate', touch: true

    validates :value, presence: true
    validates :value, uniqueness: { scope: :field_id }
    validates :value, format: { without: Regex::EMOJI }
  end
end
