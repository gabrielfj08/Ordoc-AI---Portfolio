module PrinterFlow
  class ExternalRequester < Requester
    devise :database_authenticatable, :registerable, :lockable

    NOTIFICATION = Hash(
      sms: 0,
      email: 1
    )

    enum notification: NOTIFICATION

    before_validation :generate_prn
    before_validation :format_cpf_cnpj

    after_create_commit -> { notify('send_password_notification') }

    validates :cpf_cnpj, :email, :birth_date, :phone, :notification, presence: true
    validates :password, presence: true, on: :update, unless: lambda { |external_requester|
                                                                external_requester.password.nil?
                                                              }
    validates :cpf_cnpj, :email, uniqueness: { scope: :organization_id }
    validates :password, format: { with: Regex::PASSWORD_FORMATTER }, on: %i[update], unless: lambda { |external_requester|
                                                                                                external_requester.password.nil?
                                                                                              }
    validates :phone, format: { with: Regex::CELLPHONE_FORMATTER }, on: %i[create update]
    validates :name, :email, format: { without: Regex::EMOJI }
    validates :optional_phone, format: { with: Regex::NUMBER_FORMATTER }, on: %i[create update],
                               unless: ->(external_requester) { external_requester.optional_phone.blank? }
    validates :birth_date, comparison: { less_than_or_equal_to: Date.today }

    validate :ensure_valid_cpf_cnpj

    has_many :reports, class_name: 'PrinterFlow::External::Report', foreign_key: :external_requester_id,
                       dependent: :destroy
    has_many :shared_procedures, class_name: 'PrinterFlow::External::SharedProcedure', foreign_key: :external_requester_id,
                                 dependent: :destroy
    has_many :shared_procedures_granted, class_name: 'PrinterFlow::External::SharedProcedure',
                                         foreign_key: :created_by_id, dependent: :destroy
    has_many :tasks, class_name: 'PrinterFlow::Task', foreign_key: 'group_assignee_id', dependent: :destroy

    MAX_SIGNIN_FAILED_ATTEMPTS = 5

    def increment_failed_attempts_or_lock_account
      increment_failed_attempts
      update!(blocked: true) if MAX_SIGNIN_FAILED_ATTEMPTS <= failed_attempts + 1
    end

    def token
      JsonWebToken.encode({ subject: id, expiration_time: JsonWebToken.expiration_time })
    end

    def update_password(params)
      raise ::Error::PrinterCloud::InvalidCurrentPasswordError unless valid_password?(params[:current_password])
      raise ::Error::PrinterCloud::PasswordsDoNotMatchError unless params[:password] == (params[:password_confirmation])

      update!(password: params[:password])
      update!(changed_password: true)
      notify('send_password_changed_notification')
    end

    def generate_password
      ActiveRecord::Base.transaction do
        password = RandomPassword.generate
        self.password = password
        save(validate: false)
        password
      end
    end

    def user
      nil
    end

    def notify(method)
      if sms?
        PrinterFlow::ExternalRequesterNotifierSms.public_send(method, self)
      else
        ExternalRequesterNotifierMailer.public_send(method, self).deliver
      end
    end

    def generate_one_time_password
      self.one_time_password = 6.times.map { rand(10) }.join
      self.one_time_password_sent_at = Time.now
      save!
    rescue ActiveRecord::RecordInvalid => e
      generate_one_time_password
    end

    def one_time_password_valid?
      one_time_password_sent_at + 6.hours > Time.now
    end

    private

    def ensure_valid_cpf_cnpj
      errors.add(:cpf_cnpj, :invalid) unless valid_cpf_cnpj?
    end

    def valid_cpf_cnpj?
      CPF.valid?(cpf_cnpj) || CNPJ.valid?(cpf_cnpj)
    end

    def format_cpf_cnpj
      self.cpf_cnpj = Formatters.remove_non_numeric(cpf_cnpj) if cpf_cnpj.present?
    end

    def prn_resource_id
      "requester_external/#{cpf_cnpj}"
    end
  end
end
