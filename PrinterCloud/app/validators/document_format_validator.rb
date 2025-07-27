class DocumentFormatValidator < ActiveModel::EachValidator
  def validate_each(record, _attribute, _value)
    return if File.extname(record.s3_key).in?(valid_formats)

    record.errors.add(:base,
                      I18n.t('printer_flow.errors.messages.format_invalid'))
  end

  private

  def valid_formats
    options.fetch(:in)
  end
end
