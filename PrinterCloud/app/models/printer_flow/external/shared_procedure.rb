module PrinterFlow
  module External
    class SharedProcedure < ApplicationRecord
      include AASM
      include Filterable
      include Orderable

      self.table_name = 'printer_flow.shared_procedures'
      self.per_page = 10

      STATUSES = Hash(
        created: 0,
        accepted: 1,
        refused: 2
      )

      enum status: STATUSES
      aasm column: :status, enum: true do
        state :created, initial: true
        state :accepted, :refused

        event :accept do
          transitions from: :created, to: :accepted
        end

        event :refuse do
          after do
            if external_requester.is_a?(PrinterFlow::ExternalRequester)
              notify('send_shared_procedure_refused_notification', created_by)
            end
          end

          transitions from: %i[created accepted], to: :refused
        end
      end

      after_create_commit -> { notify('send_shared_procedure_created_notification', external_requester) }

      validates :external_requester_id, uniqueness: { scope: :procedure_id }

      validates_with SharedProcedureValidator

      belongs_to :external_requester, class_name: 'PrinterFlow::ExternalRequester'
      belongs_to :created_by, class_name: 'PrinterFlow::ExternalRequester'
      belongs_to :procedure, class_name: 'PrinterFlow::Procedure'

      has_many :justification_notes, as: :justifiable, class_name: 'PrinterFlow::JustificationNote', dependent: :destroy

      scope :filter_by_created_by_id, ->(created_by_id) { where(created_by_id: created_by_id) }
      scope :filter_by_external_requester_id, lambda { |external_requester_id|
                                                where(external_requester_id: external_requester_id)
                                              }
      scope :filter_by_procedure_id, ->(procedure_id) { where(procedure_id: procedure_id) }
      scope :filter_by_status, lambda { |status|
                                 where(status: status.map(&:to_sym) & STATUSES.keys)
                               }

      def notify(method, requester)
        if requester.sms?
          PrinterFlow::ExternalRequesterNotifierSms.public_send(method, requester, self)
        else
          ExternalRequesterNotifierMailer.public_send(method, requester, self).deliver
        end
      end
    end
  end
end
