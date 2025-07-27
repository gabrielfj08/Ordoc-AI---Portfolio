module PrinterSign
  class SignatureValidator < ActiveModel::Validator
    def validate(record)
      ensure_requester_is_valid(record)
    end

    private

    def ensure_requester_is_valid(record)
      case record.procedure.source
      when 'internal'
        return unless record.requester.instance_of?(PrinterFlow::ExternalRequester)

      when 'external'
        if record.requester.instance_of?(PrinterFlow::InternalRequester) ||
           record.procedure.requester_id == record.requester_id
          return
        end
      end

      record.errors.add(:requester, :invalid)
    end
  end
end
