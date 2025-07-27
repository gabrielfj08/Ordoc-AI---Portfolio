class ComparisonValidator < ActiveModel::EachValidator
  COMPARE_CHECKS = { greater_than: :>, greater_than_or_equal_to: :>=,
                     equal_to: :==, less_than: :<, less_than_or_equal_to: :<=,
                     other_than: :!= }.freeze

  def option_value(record, option_value)
    case option_value
    when Proc
      option_value.call(record)
    when Symbol
      record.send(option_value)
    else
      option_value
    end
  end

  def validate_each(record, attr_name, value)
    options.slice(*COMPARE_CHECKS.keys).each do |option, raw_option_value|
      if value.nil? || value.blank?
        return record.errors.add(attr_name, :blank, **error_options(value, error_value(record, raw_option_value)))
      end

      unless value.send(COMPARE_CHECKS[option], option_value(record, raw_option_value))
        record.errors.add(attr_name, option,
                          **error_options(value, error_value(record, raw_option_value).strftime('%d-%m-%Y')))
      end
    rescue ArgumentError => e
      record.errors.add(attr_name, e.message)
    end
  end

  def error_options(value, option_value)
    options.except(*COMPARE_CHECKS.keys).merge!(
      count: option_value,
      value: value
    )
  end

  def error_value(record, option_value)
    case option_value
    when Proc
      option_value(record, option_value)
    else
      option_value
    end
  end

  def check_validity!
    return if (options.keys & COMPARE_CHECKS.keys).any?

    raise ArgumentError, 'Expected one of :greater_than, :greater_than_or_equal_to, '\
      ':equal_to, :less_than, :less_than_or_equal_to, nor :other_than supplied.'
  end
end

module HelperMethods
  def validates_comparison_of(*attr_names)
    validates_with ComparisonValidator, _merge_attributes(attr_names)
  end
end
