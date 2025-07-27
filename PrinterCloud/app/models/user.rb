class User < ApplicationRecord
  include Discard::Model
  include AASM
  include Filterable
  include Searchable
  include Orderable
  include Prnable

  MAX_SIGNIN_FAILED_ATTEMPTS = 5

  STATUSES = Hash(
    pending: -1,
    active: 0,
    blocked: 1
  )

  enum status: STATUSES
  aasm column: :status, enum: true do
    state :pending, initial: true
    state :active, :blocked

    event :activate do
      transitions from: %i[pending blocked], to: :active
    end

    event :block do
      transitions from: %i[active pending], to: :blocked
    end
  end

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :lockable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable

  self.discard_column = :deleted_at
  self.searchable_fields = :name, :email, :cpf

  validates_confirmation_of :password

  validates :cpf, :date_of_birth, :email, :name, :phone, :prn, presence: true
  validates :cpf, :email, :prn, uniqueness: true
  validates :phone, length: { in: 8..13 }
  validates :password, format: { with: Regex::PASSWORD_FORMATTER }, on: %i[create update], unless: lambda { |u|
                                                                                                     u.password.nil?
                                                                                                   }
  validate :ensure_valid_cpf
  validate :ensure_valid_admin

  before_validation :format_cpf
  before_validation :format_phone
  before_validation :generate_prn

  has_one :inbox, dependent: :destroy
  has_many :requester_assignments, class_name: 'PrinterFlow::RequesterAssignment', dependent: :destroy
  has_many :internal_requester, class_name: 'PrinterFlow::InternalRequester', through: :requester_assignments, source: :requester,
                                dependent: :destroy
  has_many :group_requesters, class_name: 'PrinterFlow::GroupRequester', through: :requester_assignments, source: :requester,
                              dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :organizations, through: :roles
  has_many :departments, through: :roles
  has_many :permissions, class_name: 'Permission', foreign_key: 'user_id', dependent: :destroy
  has_many :permissions_granted, class_name: 'Permission', foreign_key: 'permission_granted_by_id', dependent: :destroy
  has_many :recent_documents, dependent: :destroy
  has_many :printer_air_recent_documents, class_name: 'PrinterAir::RecentDocument', dependent: :destroy
  has_many :latest_documents_accessed, through: :recent_documents, source: :document, dependent: :destroy
  has_many :created_documents,     inverse_of: 'created_by', class_name: 'Document', foreign_key: 'created_by_id',
                                   dependent: :nullify
  has_many :updated_documents, inverse_of: 'updated_by', class_name: 'Document', foreign_key: 'updated_by_id',
                               dependent: :nullify
  has_many :deleted_documents,     inverse_of: 'deleted_by', class_name: 'Document',  foreign_key: 'deleted_by_id',
                                   dependent: :nullify
  has_many :created_directories,   inverse_of: 'created_by', class_name: 'Directory', foreign_key: 'created_by_id',
                                   dependent: :nullify
  has_many :updated_directories,   inverse_of: 'updated_by', class_name: 'Directory', foreign_key: 'updated_by_id',
                                   dependent: :nullify
  has_many :trashed_documents,     inverse_of: 'trashed_by', class_name: 'Document',  foreign_key: 'trashed_by_id',
                                   dependent: :nullify
  has_many :created_organizations, inverse_of: 'created_by', class_name: 'Organization', foreign_key: 'created_by_id',
                                   dependent: :nullify
  has_many :download_links, dependent: :destroy
  has_many :document_copies, class_name: 'PrinterAir::DocumentCopy', foreign_key: 'created_by_id', dependent: :destroy
  has_many :directory_upload_jobs, class_name: 'PrinterAir::DirectoryUploadJob', foreign_key: 'created_by_id',
                                   dependent: :destroy
  has_many :download_jobs, class_name: 'PrinterAir::DownloadJob', foreign_key: 'created_by_id',
                           dependent: :destroy
  has_and_belongs_to_many :user_groups, class_name: 'Flow::UserGroup'
  has_many :user_group_assignments, class_name: 'PrinterCloud::UserGroupAssignment', dependent: :destroy
  has_many :printer_cloud_user_groups, class_name: 'PrinterCloud::UserGroup', through: :user_group_assignments,
                                       source: :user_group
  has_many :task_attachment_signatures, class_name: 'Flow::TaskAttachmentSignature'
  has_many :task_assignments, class_name: 'Flow::TaskAssignment'
  has_many :tasks, class_name: 'Flow::Task', through: :task_assignments
  has_many :group_assignments, class_name: 'Flow::TaskAssignment', through: :user_groups
  has_many :group_tasks_assignments, class_name: 'Flow::Task', through: :group_assignments, source: :task
  has_many :interested_procedures, class_name: 'Flow::ProcedureInterested'
  has_many :procedures_of_interest, class_name: 'Flow::Procedure', through: :interested_procedures, source: :procedure
  has_many :created_procedures, inverse_of: 'creator', class_name: 'Flow::Procedure', foreign_key: 'created_by_id',
                                dependent: :nullify
  has_many :policy_attachments, as: :policy_attachable, class_name: 'PrinterCloud::PolicyAttachment',
                                dependent: :destroy
  has_many :policies, through: :policy_attachments
  has_many :active_groups, lambda {
                             where(status: :active)
                           }, class_name: 'PrinterCloud::UserGroup', through: :user_group_assignments,
                              source: :user_group

  has_many :user_group_policies, class_name: 'PrinterCloud::Policy', through: :active_groups,
                                 source: :policies
  has_many :histories
  has_many :batch_operations, class_name: 'PrinterAir::BatchOperation', foreign_key: 'created_by_id',
                              dependent: :destroy

  scope :filter_by_department_id, lambda { |department_id|
                                    joins(:roles).where(roles: { department_id: department_id }).distinct
                                  }
  scope :filter_by_status, ->(status) { where(status: status.map(&:to_sym) & STATUSES.keys) }
  scope :filter_by_email, ->(email) { where(email: email) }
  scope :filter_by_name, ->(name) { where(name: name) }
  scope :filter_by_organization_id, lambda { |organization_ids|
                                      joins(:roles).where(roles: { organization_id: organization_ids }).distinct
                                    }
  scope :filter_by_role, ->(role) { joins(:roles).where(roles: { type: role }).distinct }
  scope :filter_by_user_group_id, ->(user_group_id) { joins(:user_groups).where('user_groups.id' => user_group_id) }
  scope :filter_by_printer_cloud_user_group_id, lambda { |printer_cloud_user_group_id|
                                                  joins(:printer_cloud_user_groups).where(printer_cloud_user_groups: { id: printer_cloud_user_group_id })
                                                }
  scope :filter_by_policy_id, lambda { |policy_id|
                                joins(:policy_attachments).where(policy_attachments: { policy_id: policy_id })
                              }
  scope :admin, -> { joins(:roles).where(roles: { type: Roles::ADMIN }).distinct }
  scope :organization_manager, -> { joins(:roles).where(roles: { type: Roles::ORGANIZATION_MANAGER }).distinct }
  scope :organization_member, -> { joins(:roles).where(roles: { type: Roles::ORGANIZATION_MEMBER }).distinct }
  scope :department_member, -> { joins(:roles).where(roles: { type: Roles::DEPARTMENT_MEMBER }).distinct }
  scope :manager_by_organization_id, lambda { |organization_id|
                                       joins(:roles).where(roles: { organization_id: organization_id, type: Roles::ORGANIZATION_MANAGER }).distinct
                                     }
  scope :organization_member_by_organization_id, lambda { |organization_id|
                                                   joins(:roles).where(roles: { organization_id: organization_id, type: Roles::ORGANIZATION_MEMBER }).distinct
                                                 }
  scope :department_member_by_organization_id, lambda { |organization_id|
                                                 joins(roles: { department: :organization }).where(organization: { id: organization_id }).distinct
                                               }
  scope :search_by_name,        ->(query) { where(User.arel_table[:name].matches("%#{query}%")) }
  scope :search_by_email,       ->(query) { where(User.arel_table[:email].matches("%#{query}%")) }
  scope :search_by_cpf,       ->(query) { where(User.arel_table[:cpf].matches("%#{query.gsub(%r{[-/.]}, '')}%")) }
  scope :not_locked,          -> { where(locked_at: nil) }
  scope :confirmed,           -> { where.not(confirmed_at: nil) }
  scope :not_confirmed,       -> { where(confirmed_at: nil) }

  after_discard do
    roles.destroy_all
    permissions.destroy_all
    permissions_granted.destroy_all
    download_links.destroy_all
    recent_documents.destroy_all
    latest_documents_accessed.destroy_all
    inbox.discard
  end

  after_undiscard do
    inbox.undiscard
  end

  def admin?
    !roles.admin.empty?
  end

  def organization_manager?
    !roles.organization_manager.empty?
  end

  def organization_member?
    !roles.organization_member.empty?
  end

  def department_member?
    !roles.department_member.empty?
  end

  def procedures_of_interest_as_reader
    Flow::Procedure.kept.where(id: interested_procedures.where(interested_type: :reader).pluck(:procedure_id))
  end

  def procedures_of_interest_as_editor
    Flow::Procedure.kept.where(id: interested_procedures.where(interested_type: :editor).pluck(:procedure_id))
  end

  def token
    JsonWebToken.encode({ sub: id })
  end

  def shared_directories
    Directory.joins(permissions: :user).where(user: { id: id }).where(permissions: { scope: 1..2 })
  end

  def shared_documents
    Document.kept.joins(permissions: :user).where(user: { id: id }).where(permissions: { scope: 1..2 })
  end

  def increment_failed_attempts_or_lock_account
    increment_failed_attempts
    block! && lock_access! if MAX_SIGNIN_FAILED_ATTEMPTS <= failed_attempts
  end

  # TODO: ADD MODEL TEST
  def organizations_by_role(role)
    Organization.joins(roles: :user).where('users.id = ?', id).where('roles.type = ?', Roles::ROLE_MAPPINGS[role])
  end

  # TODO: ADD MODEL TEST
  def departments_by_organization_role(role)
    Department.joins(organization: [roles: :user]).where('users.id = ?', id).where('roles.type = ?',
                                                                                   Roles::ROLE_MAPPINGS[role])
  end

  def profiles
    profiles = []

    profiles << I18n.t('activerecord.attributes.user.profiles.administrator') if admin?
    profiles << I18n.t('activerecord.attributes.user.profiles.manager') if organization_manager?
    profiles << I18n.t('activerecord.attributes.user.profiles.member') if organization_member?

    profiles
  end

  def self.unlock_access_by_token(unlock_token)
    original_token = unlock_token
    unlock_token = Devise.token_generator.digest(self, :unlock_token, unlock_token)
    lockable = find_or_initialize_with_error_by(:unlock_token, unlock_token)
    raise Error::UnlockTokenExpiredError if lockable.unlock_token_sent_at <= Time.now - (3600 * 12)

    lockable.unlock_access! if lockable.persisted?
    lockable.unlock_token = original_token
    lockable
  end

  def send_unlock_instructions
    raw, enc = Devise.token_generator.generate(self.class, :unlock_token)
    self.unlock_token = enc
    self.unlock_token_sent_at = Time.now
    save(validate: false)
    UserNotifierMailer.send_unlock_instructions_email(self, raw).deliver
    raw
  end

  def update_password(params)
    raise Error::PrinterCloud::InvalidCurrentPasswordError unless valid_password?(params[:current_password])
    raise Error::PrinterCloud::PasswordsDoNotMatchError unless params[:password] == (params[:password_confirmation])

    update!(password: params[:password])
  end

  def send_confirmation_instructions
    @raw_confirmation_token = confirmation_token
    generate_confirmation_token! unless @raw_confirmation_token

    opts = mail_to = pending_reconfirmation? ? unconfirmed_email : email
    UserNotifierMailer.send_confirmation_instructions_email(self, mail_to).deliver
  end

  def user_groups_count
    printer_cloud_user_groups.count
  end

  private

  def service_name
    'printer_cloud'
  end

  def prn_resource_id
    "#{self.class.to_s.underscore}/#{cpf}"
  end

  def ensure_valid_admin
    raise Error::PrinterCloud::ForbiddenError if admin.present? && !admin_valid_email
  end

  def admin_valid_email
    email.include?('@printerdobrasil.com.br')
  end

  def ensure_valid_cpf
    errors.add(:cpf, message: I18n.t('activerecord.errors.messages.invalid')) unless valid_cpf?
  end

  def ensure_unique_cpf
    user = User.find_by(cpf: cpf)

    errors.add(:cpf, 'deve ser único') if user && user != self
  end

  def valid_cpf?
    CPF.valid?(cpf)
  end

  def format_cpf
    self.cpf = Formatters.remove_non_numeric(cpf)
  end

  def format_phone
    self.phone = Formatters.remove_non_numeric(phone)
  end
end
