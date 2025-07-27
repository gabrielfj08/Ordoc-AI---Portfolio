class ProcedureNumberValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~ /\A[0-9]+\/[0-9]+\Z/
      record.errors.add attribute, :invalid
    end
  end
end
