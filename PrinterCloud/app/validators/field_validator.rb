class FieldValidator < ActiveModel::EachValidator
  def validate(record)
    if record.field.field_type == 'select_field' || record.field.field_type == 'radio' || record.field.field_type == 'checkbox'
      return
    end

    record.errors.add :field, (options[:message] || I18n.t('printer_flow.errors.messages.is_not_selectable_field'))
  end
end
