class FieldTypeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    @record = record
    @attribute = attribute
    @value = value

    validate_value_type
    validate_field_type
  end

  private

  def validate_value_type
    return unless @record.value.present? && @record.array_values.present?

    @record.errors.add(@attribute,
                       I18n.t('printer_flow.errors.messages.already_filled'))
  end

  def validate_field_type
    send(@record.field_type) if @value.present?
  end

  def checkbox
    @value.each do |value|
      unless @record.options.include?(value)
        @record.errors.add(@record.label,
                           I18n.t('printer_flow.errors.messages.invalid_selected_option'))
      end
    end
  end

  def radio
    @value.each do |value|
      unless @record.options.include?(value)
        @record.errors.add(@record.label,
                           I18n.t('printer_flow.errors.messages.invalid_selected_option'))
      end
    end
  end

  def select_field
    @value.each do |value|
      unless @record.options.include?(value)
        @record.errors.add(@record.label,
                           I18n.t('printer_flow.errors.messages.invalid_selected_option'))
      end
    end
  end

  def short_text
    return unless @value.length > 255

    @record.errors.add(@attribute,
                       I18n.t('printer_flow.errors.messages.exceeds_short_text_character_limit'))
  end

  def long_text
    return unless @value.length > 4_000_000

    @record.errors.add(@record.label,
                       I18n.t('printer_flow.errors.messages.exceeds_long_text_character_limit'))
  end

  def numeric
    return unless Regex::NUMERIC_FORMATTER.match?(@value)

    @record.errors.add(@record.label,
                       I18n.t('printer_flow.errors.messages.only_numeric'))
  end

  def date
    if Regex::DATA_FORMATTER.match?(@value)
      begin
        Date.parse(@value)
      rescue Date::Error
        @record.errors.add(@record.label, I18n.t('printer_flow.errors.messages.is_invalid'))
      end
    else
      @record.errors.add(@record.label, I18n.t('printer_flow.errors.messages.is_invalid'))
    end
  end

  def phone
    return if Regex::NUMBER_FORMATTER.match?(@value)

    @record.errors.add(@record.label,
                       I18n.t('printer_flow.errors.messages.is_invalid'))
  end

  def email
    return if @value =~ /\A(\S+)@(.+)\.(\S+)\z/

    @record.errors.add(@record.label,
                       I18n.t('printer_flow.errors.messages.is_invalid'))
  end

  def cpf
    @record.errors.add(@record.label, I18n.t('printer_flow.errors.messages.is_invalid')) unless CPF.valid?(@value)
  end

  def cnpj
    @record.errors.add(@record.label, I18n.t('printer_flow.errors.messages.is_invalid')) unless CNPJ.valid?(@value)
  end

  def time
    if @record.value.length == 5 && Regex::TIME_FORMATTER.match?(@value)
      begin
        Time.parse(@value)
      rescue StandardError
        @record.errors.add(@record.label, I18n.t('printer_flow.errors.messages.is_invalid'))
      end
    else
      @record.errors.add(@record.label, I18n.t('printer_flow.errors.messages.is_invalid'))
    end
  end
end
