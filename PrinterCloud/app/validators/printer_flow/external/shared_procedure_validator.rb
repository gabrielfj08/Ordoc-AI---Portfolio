module PrinterFlow
  module External
    class SharedProcedureValidator < ActiveModel::Validator
      def validate(record)
        can_not_share_object_with_itself(record)

        ensure_procedure_is_external(record)
      end

      private

      def can_not_share_object_with_itself(record)
        record.errors.add(:external_requester, :invalid) if record.external_requester == record.created_by
      end

      def ensure_procedure_is_external(record)
        record.errors.add(:procedure, :invalid) if record.procedure.internal?
      end
    end
  end
end
