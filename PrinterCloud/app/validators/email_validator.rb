class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~ /\A(\S+)@(.+)\.(\S+)\z/
      record.errors.add attribute, :invalid
    end
  end
end
