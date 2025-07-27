class FileSizeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return unless value.attached?
    return if limit_size.include?(value.byte_size)

    record.errors.add(attribute, :byte_size, in: limit_size)
  end

  private

  def limit_size
    options.fetch(:in)
  end
end
