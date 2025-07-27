module PrinterFlow
  class InternalRequester < Requester
    self.per_page = 10

    before_commit :sync_user_status
    before_validation :generate_prn
    before_validation :format_cpf

    validates :cpf_cnpj, :prn, presence: true
    validates :cpf_cnpj, uniqueness: { scope: %i[organization_id type] }
    validates :phone, length: { in: 11..13 }, unless: -> { phone.blank? }
    validate :ensure_valid_cpf

    has_one :requester_assignment, class_name: 'PrinterFlow::RequesterAssignment', foreign_key: 'requester_id',
                                   dependent: :destroy
    has_one :user, class_name: 'PrinterCloud::User', through: :requester_assignment

    has_many :tasks, class_name: 'PrinterFlow::Task', foreign_key: 'assignee_id'

    private

    def sync_user_status
      return if user.nil?

      update(status: :inactive) if user.discarded? && active? || user.inactive? && active?
    end

    def ensure_valid_cpf
      errors.add(:cpf_cnpj, :invalid) unless valid_cpf?
    end

    def valid_cpf?
      CPF.valid?(cpf_cnpj)
    end

    def format_cpf
      self.cpf_cnpj = Formatters.remove_non_numeric(cpf_cnpj) if cpf_cnpj.present?
    end

    def prn_resource_id
      "requester_internal/#{cpf_cnpj}"
    end
  end
end
