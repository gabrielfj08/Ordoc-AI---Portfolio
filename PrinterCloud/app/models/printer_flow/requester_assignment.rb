module PrinterFlow
  class RequesterAssignment < ApplicationRecord
    self.table_name = 'printer_flow.requester_assignments'

    before_validation :ensure_requester_is_active, on: :create

    belongs_to :user, class_name: 'PrinterCloud::User'
    belongs_to :requester, class_name: 'PrinterFlow::Requester'

    validates :user_id, uniqueness: { scope: :requester_id }

    private

    def ensure_requester_is_active
      return unless requester.instance_of?(PrinterFlow::GroupRequester) && !requester.active?

      errors.add(:requester, message: I18n.t('printer_flow.errors.messages.is_inactive'))
    end
  end
end
