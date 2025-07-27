module PrinterCloud
  class User < ApplicationRecord
    include Discard::Model
    include AASM
    include Filterable
    include Searchable
    include Orderable
    include Prnable

    MAX_SIGNIN_FAILED_ATTEMPTS = 5

    STATUSES = Hash(
      inactive: -1,
      active: 0,
      blocked: 1
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :active, initial: true
      state :blocked
      state :inactive

      event :activate do
        transitions from: %i[blocked inactive], to: :active
      end

      event :block do
        transitions from: %i[active], to: :blocked
      end

      event :deactivate do
        transitions from: %i[active], to: :inactive
      end
    end

    after_discard do
      requester_assignments.destroy_all
    end

    after_undiscard do
      find_or_create_user_requester
    end

    devise :database_authenticatable, :registerable, :lockable,
           :trackable, :rememberable, :validatable

    self.discard_column = :deleted_at
    self.searchable_fields = :name, :email, :cpf, :username, :registration_number

    validates_confirmation_of :password

    validates :one_time_password, uniqueness: true, allow_blank: true
    validates :one_time_password, length: 6..6, allow_blank: true
    validates :name, :username, :prn, presence: true
    validates :prn, uniqueness: { conditions: -> { where(deleted_at: nil) } }
    validates :phone, length: { in: 11..13 }, unless: -> { phone.blank? }
    validates :email, :username, uniqueness: { scope: :organization, conditions: -> { where(deleted_at: nil) } }
    validates :password, format: { with: Regex::PASSWORD_FORMATTER }, on: %i[update], unless: lambda { |u|
                                                                                                u.password.nil?
                                                                                              }
    validates :username, format: { with: Regex::USERNAME_FORMATTER, multiline: true }, on: %i[create]
    validates :name, :email, format: { without: Regex::EMOJI }
    validates :cpf, uniqueness: { scope: :organization, conditions: lambda {
                                                                      where(deleted_at: nil)
                                                                    } }, unless: lambda { |u|
                                                                                   u.cpf.blank?
                                                                                 }

    validate :ensure_valid_cpf, unless: -> { cpf.blank? }
    validate :ensure_valid_admin
    validate :ensure_cpf_does_not_change, on: :update

    after_create_commit :find_or_create_user_requester, unless: lambda {
                                                                  cpf.blank?
                                                                }

    before_update :find_or_create_user_requester, if: -> { cpf_changed? }

    after_create_commit :add_printer_cloud_managed_policies

    before_validation :format_cpf, unless: -> { cpf.blank? }
    before_validation :format_phone, unless: -> { phone.blank? }
    before_validation :generate_prn

    belongs_to :organization

    has_one :requester_assignment, class_name: 'PrinterFlow::RequesterAssignment'
    has_one :internal_requester, class_name: 'PrinterFlow::InternalRequester', through: :requester_assignment,
                                 source: :requester, touch: true

    has_many :directory_infos, class_name: 'PrinterAir::DirectoryInfo', foreign_key: 'created_by_id',
                               dependent: :destroy
    has_many :requester_assignments, class_name: 'PrinterFlow::RequesterAssignment', dependent: :destroy
    has_many :group_requesters, class_name: 'PrinterFlow::GroupRequester', through: :requester_assignments,
                                source: :requester
    has_many :tasks, class_name: 'PrinterFlow::Task', through: :internal_requester, foreign_key: 'assignee_id'
    has_many :recent_documents, class_name: 'PrinterAir::RecentDocument', dependent: :destroy
    has_many :created_documents,     inverse_of: 'created_by', class_name: 'PrinterAir::Document', foreign_key: 'created_by_id',
                                     dependent: :nullify
    has_many :updated_documents, inverse_of: 'updated_by', class_name: 'PrinterAir::Document', foreign_key: 'updated_by_id',
                                 dependent: :nullify
    has_many :deleted_documents,     inverse_of: 'deleted_by', class_name: 'PrinterAir::Document',  foreign_key: 'deleted_by_id',
                                     dependent: :nullify
    has_many :created_directories,   inverse_of: 'created_by', class_name: 'PrinterAir::Directory', foreign_key: 'created_by_id',
                                     dependent: :nullify
    has_many :updated_directories,   inverse_of: 'updated_by', class_name: 'PrinterAir::Directory', foreign_key: 'updated_by_id',
                                     dependent: :nullify
    has_many :document_copies, class_name: 'PrinterAir::DocumentCopy', foreign_key: 'created_by_id',
                               dependent: :nullify
    has_many :directory_upload_jobs, class_name: 'PrinterAir::DirectoryUploadJob', foreign_key: 'created_by_id',
                                     dependent: :destroy
    has_many :download_jobs, class_name: 'PrinterAir::DownloadJob', foreign_key: 'created_by_id',
                             dependent: :destroy
    has_many :user_group_assignments, class_name: 'PrinterCloud::UserGroupAssignment', dependent: :destroy
    has_many :user_groups, class_name: 'PrinterCloud::UserGroup', through: :user_group_assignments,
                           source: :user_group
    has_many :policy_attachments, as: :policy_attachable, class_name: 'PrinterCloud::PolicyAttachment',
                                  dependent: :destroy
    has_many :policies, through: :policy_attachments
    has_many :active_groups, lambda {
                               where(status: :active)
                             }, class_name: 'PrinterCloud::UserGroup', through: :user_group_assignments,
                                source: :user_group

    has_many :user_group_policies, class_name: 'PrinterCloud::Policy', through: :active_groups,
                                   source: :policies
    has_many :batch_operations, class_name: 'PrinterAir::BatchOperation', foreign_key: 'created_by_id',
                                dependent: :destroy
    has_many :signatures, class_name: 'PrinterSign::Signature', through: :internal_requester

    scope :filter_by_status, ->(status) { where(status: status.map(&:to_sym) & STATUSES.keys) }
    scope :filter_by_email, ->(email) { where(email: email) }
    scope :filter_by_name, ->(name) { where(name: name) }
    scope :filter_by_organization_id, ->(organization_id) { where(organization_id: organization_id) }
    scope :filter_by_user_group_id, lambda { |user_group_id|
                                      joins(:user_groups).where(user_groups: { id: user_group_id })
                                    }
    scope :filter_by_printer_cloud_user_group_id, lambda { |printer_cloud_user_group_id|
                                                    joins(:user_groups).where(user_groups: { id: printer_cloud_user_group_id })
                                                  }
    scope :filter_by_policy_id, lambda { |policy_id|
                                  joins(:policy_attachments).where(policy_attachments: { policy_id: policy_id })
                                }
    scope :filter_by_signed_procedure_document_id, lambda { |procedure_document_id|
                                                     joins(signatures: :procedure_document).where(procedure_document: { id: procedure_document_id })
                                                   }
    scope :filter_by_signed_task_document_id, lambda { |task_document_id|
                                                joins(signatures: :task_document).where(task_document: { id: task_document_id })
                                              }
    scope :search_by_username, ->(query) { where(User.arel_table[:username].matches("%#{query}%")) }
    scope :search_by_name, ->(query) { where(User.arel_table[:name].matches("%#{query}%")) }
    scope :search_by_email, ->(query) { where(User.arel_table[:email].matches("%#{query}%")) }
    scope :search_by_cpf, ->(query) { where(User.arel_table[:cpf].matches("%#{query.gsub(%r{[-/.]}, '')}%")) }
    scope :search_by_registration_number, lambda { |query|
                                            where(User.arel_table[:registration_number].matches("%#{query}%"))
                                          }
    scope :not_locked,          -> { where(locked_at: nil) }
    scope :confirmed,           -> { where.not(confirmed_at: nil) }
    scope :not_confirmed,       -> { where(confirmed_at: nil) }

    @@sns_client = ::Aws::SNS::Client.new(credentials: PrinterCloud::Aws.credentials)

    def self.sns_client=(client)
      @@sns_client = client
    end

    def generate_password
      ActiveRecord::Base.transaction do
        password = RandomPassword.generate
        self.changed_password = false
        self.password = password
        save(validate: false)
        password
      end
    end

    def generate_one_time_password
      self.one_time_password = 6.times.map { rand(10) }.join
      self.one_time_password_sent_at = Time.now
      save
    rescue ActiveRecord::RecordInvalid => e
      generate_one_time_password
    end

    def find_or_create_user_requester
      requester = ::PrinterFlow::InternalRequester.where(cpf_cnpj: cpf, organization_id: organization_id)
                                                  .first_or_create!(name: name,
                                                                    birth_date: date_of_birth,
                                                                    organization_id: organization_id,
                                                                    phone: phone,
                                                                    email: email,
                                                                    cpf_cnpj: cpf)

      PrinterFlow::RequesterAssignment.find_or_create_by!(user_id: id, requester_id: requester.id)

      requester.activate! if requester.inactive?
    end

    def add_printer_cloud_managed_policies
      policy = ::PrinterCloud::Policy.where(organization_id: organization_id, name: %w[PrinterFlowDenyDirectory],
                                            effect: 'deny', source: 'printer_cloud_managed', service: :printer_air)

      policies.push(policy)
    end

    def token
      JsonWebToken.encode({ sub: id, exp: JsonWebToken.expiration_time })
    end

    def increment_failed_attempts_or_lock_account
      increment_failed_attempts
      block! if MAX_SIGNIN_FAILED_ATTEMPTS <= failed_attempts
    end

    def one_time_password_valid?
      one_time_password_sent_at + 6.hours > Time.now
    end

    def send_one_time_password_sms
      raise ::Error::PrinterCloud::PhoneBlankError if phone.blank?

      @@sns_client.publish({
                             phone_number: "+55#{phone}",
                             message: "PRINTER CLOUD: seu codigo e #{one_time_password}. Nao compartilhe com ninguem."
                           }, message_attributes: {
                             'EventType' => {
                               data_type: 'String'
                             }
                           })
    end

    def send_one_time_password_email
      UserNotifierMailer.send_one_time_password_email(self).deliver
    end

    def update_password(params)
      raise ::Error::PrinterCloud::InvalidCurrentPasswordError unless valid_password?(params[:current_password])
      raise ::Error::PrinterCloud::PasswordsDoNotMatchError unless params[:password] == (params[:password_confirmation])

      update!(password: params[:password])
    end

    def organizations_count
      # TODO: remove
      1
    end

    def user_groups_count
      user_groups.count
    end

    def send_random_password_sms
      raise ::Error::PrinterCloud::PhoneBlankError if phone.blank?

      generate_password
      @@sns_client.publish({
                             phone_number: "+55#{phone}",
                             message: "PRINTER CLOUD: sua senha de acesso ao Printer Cloud e\n\n #{password}\n\nNao compartilhe com ninguem."
                           }, message_attributes: {
                             'EventType' => {
                               data_type: 'String'
                             }
                           })
    end

    def send_random_password_email
      UserNotifierMailer.send_password_email(self).deliver
    end

    def send_login_instructions_email
      UserNotifierMailer.send_login_instructions_email(self).deliver
    end

    private

    def service_name
      'printer_cloud'
    end

    def prn_resource_id
      "#{self.class.to_s.demodulize.underscore}/#{username}"
    end

    def ensure_valid_admin
      raise ::Error::PrinterCloud::ForbiddenError if admin.present? && !admin_valid_email
    end

    def admin_valid_email
      email.include?('@printerdobrasil.com.br')
    end

    def ensure_valid_cpf
      errors.add(:cpf, message: I18n.t('activerecord.errors.messages.invalid')) unless valid_cpf?
    end

    def ensure_unique_cpf
      user = User.find_by(cpf: cpf)

      errors.add(:cpf, 'printer_cloud.errors.messages.must_be_uniq') if user && user != self
    end

    def valid_cpf?
      CPF.valid?(cpf)
    end

    def ensure_cpf_does_not_change
      return if cpf_was.blank? || cpf_was == cpf

      errors.add(:cpf, I18n.t('printer_cloud.errors.messages.can_not_change'))
    end

    def format_cpf
      self.cpf = Formatters.remove_non_numeric(cpf)
    end

    def format_phone
      self.phone = Formatters.remove_non_numeric(phone)
    end

    # devise method (email uniqueness with scope)
    def will_save_change_to_email?
      false
    end

    # devise method (email uniqueness with scope)
    def email_changed?
      false
    end
  end
end
