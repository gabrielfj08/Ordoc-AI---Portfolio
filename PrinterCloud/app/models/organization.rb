class Organization < ApplicationRecord
  include AASM
  include Activable
  include ActionView::Helpers::NumberHelper
  include Discard::Model
  include Filterable
  include Orderable
  include Searchable
  include Prnable

  self.discard_column = :deleted_at
  self.searchable_fields = %i[corporate_name cnpj email site contact_name]

  validates :cnpj, :contact_name, :contact_phone, :corporate_name, :email, :phone, :prn, :subdomain, presence: true
  validates :cnpj, :prn, :subdomain, uniqueness: true
  validates :corporate_name, format: { without: Regex::EMOJI }

  validate :ensure_valid_cnpj

  before_validation :format_cnpj
  before_validation :generate_prn

  has_one :address, as: :addressable, dependent: :destroy
  has_one :root_directory, lambda {
                             where(parent_directory_id: nil, name: 'Meu Air')
                           }, class_name: 'PrinterAir::Directory', dependent: :destroy
  has_one :recycle_bin_directory, lambda {
                                    where(parent_directory_id: nil, name: 'Lixeira')
                                  }, class_name: 'PrinterAir::Directory', dependent: :destroy

  has_one :recycle_bin, dependent: :destroy
  has_one :theme, class_name: 'PrinterCloud::Theme', dependent: :destroy
  has_one :decree, class_name: 'PrinterCloud::Decree', dependent: :destroy

  has_many :shared_objects, class_name: 'PrinterAir::SharedObject', dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :users, through: :roles
  has_many :inboxes, through: :users
  has_many :optical_documents, through: :inboxes, source: :documents
  has_many :departments, dependent: :destroy
  has_many :directories, through: :departments
  has_many :printer_air_directories, class_name: 'PrinterAir::Directory', dependent: :destroy
  has_many :printer_air_documents, class_name: 'PrinterAir::Document', through: :printer_air_directories,
                                   source: :documents, dependent: :destroy
  has_many :documents, through: :departments
  has_many :procedures, through: :departments
  has_many :procedure_attachments, through: :procedures, source: :attachments
  has_many :task_attachments, through: :tasks, source: :attachments
  has_many :reports, class_name: 'PrinterReports::Report', dependent: :destroy
  has_many :printer_cloud_users, class_name: 'PrinterCloud::User', dependent: :destroy
  has_many :user_groups, class_name: 'PrinterCloud::UserGroup', dependent: :destroy
  has_many :policies, class_name: 'PrinterCloud::Policy', dependent: :destroy
  has_many :requesters, class_name: 'PrinterFlow::Requester'
  has_many :external_requesters, class_name: 'PrinterFlow::ExternalRequester'
  has_many :group_requesters, class_name: 'PrinterFlow::GroupRequester'
  has_many :procedure_templates, class_name: 'PrinterFlow::ProcedureTemplate', dependent: :destroy
  has_many :field_document_templates, class_name: 'PrinterFlow::FieldDocumentTemplate'
  has_many :printer_flow_procedures, class_name: 'PrinterFlow::Procedure', through: :procedure_templates,
                                     source: :procedures
  has_many :tasks, class_name: 'PrinterFlow::Task', through: :printer_flow_procedures, source: :tasks
  has_many :task_documents, class_name: 'PrinterFlow::TaskDocument', through: :tasks, source: :task_documents
  has_many :signatures, class_name: 'PrinterSign::Signature', through: :printer_flow_procedures, source: :signatures
  has_many :task_templates, class_name: 'PrinterFlow::TaskTemplate', dependent: :destroy
  has_many :shared_procedures, class_name: 'PrinterFlow::External::SharedProcedure', through: :printer_flow_procedures,
                               source: :shared_procedures

  has_and_belongs_to_many :apps
  belongs_to :created_by, class_name: 'User', foreign_key: 'created_by_id', optional: true

  scope :filter_by_corporate_name, lambda { |corporate_name|
                                     where(Organization.arel_table[:corporate_name].matches("%#{corporate_name}%"))
                                   }
  scope :filter_by_cnpj,           ->(cnpj) { where(Organization.arel_table[:cnpj].matches("%#{cnpj}%")) }
  scope :filter_by_email,          ->(email) { where(Organization.arel_table[:email].matches("%#{email}%")) }
  scope :filter_by_site,           ->(site) { where(Organization.arel_table[:site].matches("%#{site}%")) }
  scope :filter_by_contact_name,   lambda { |contact_name|
                                     where(Organization.arel_table[:contact_name].matches("%#{contact_name}%"))
                                   }
  scope :filter_by_status,         ->(status) { where(status: status.map(&:to_sym) & Activable::STATUSES.keys) }

  scope :search_by_corporate_name, ->(query) { where(Organization.arel_table[:corporate_name].matches("%#{query}%")) }
  scope :search_by_cnpj,           ->(query) { where(Organization.arel_table[:cnpj].matches("%#{query}%")) }
  scope :search_by_email,          ->(query) { where(Organization.arel_table[:email].matches("%#{query}%")) }
  scope :search_by_site,           ->(query) { where(Organization.arel_table[:site].matches("%#{query}%")) }
  scope :search_by_contact_name,   ->(query) { where(Organization.arel_table[:contact_name].matches("%#{query}%")) }

  scope :get_organization_by_role, lambda { |role, user_id|
                                     joins(:roles, :users).where(roles: { type: role, user_id: user_id }).uniq
                                   }

  scope :filter_by_organization_manager_id, lambda { |organization_manager_id|
                                              joins(:roles).where(roles: { type: Roles::ORGANIZATION_MANAGER, user_id: organization_manager_id })
                                            }
  scope :filter_by_organization_member_id, lambda { |organization_member_id|
                                             joins(:roles).where(roles: { type: Roles::ORGANIZATION_MEMBER, user_id: organization_member_id })
                                           }
  scope :filter_by_department_member_id, lambda { |department_member_id|
                                           joins(departments: :roles).where(roles: { user_id: department_member_id })
                                         }

  after_discard do
    roles.destroy_all
    recycle_bin.discard
    address.discard
    departments.discard_all
  end

  after_undiscard do
    recycle_bin.undiscard
    address.undiscard
    departments.undiscard_all
  end

  def air_used_storage_in_bytes
    query = <<-SQL
      SELECT SUM(byte_size)
      FROM active_storage_blobs
      JOIN active_storage_attachments
      ON active_storage_attachments.blob_id=active_storage_blobs.id
      JOIN documents
      ON documents.id=active_storage_attachments.record_id
      JOIN directories
      ON documents.directory_id=directories.id
      JOIN organizations
      ON directories.organization_id=organizations.id
      WHERE organizations.id=#{id}
      AND active_storage_attachments.record_type='PrinterAir::Document'
      AND active_storage_attachments.name='file'
      AND documents.deleted_at IS NULL
    SQL

    result = ActiveRecord::Base.connection.execute(query)
    result.getvalue(0, 0) || 0
  end

  def flow_used_storage_in_bytes
    procedure_attachments_used_storage +
      procedure_pdfs_used_storage +
      task_attachments_used_storage
  end

  def used_storage
    number_to_human_size(air_used_storage_in_bytes)
  end

  def users_count
    users.kept.count
  end

  def managers_count
    managers.kept.count
  end

  def managers
    User.kept.joins(:roles).where(roles: { organization_id: id, type: Roles::ORGANIZATION_MANAGER })
  end

  def members
    User.kept.joins(:roles).where(roles: { organization_id: id, type: Roles::ORGANIZATION_MEMBER })
  end

  # TODO: DESTROYER IS NOT WORKING BECAUSE WE HAVE recycle_bin() AND recycle_bin(user)
  def show_recycle_bin(user)
    current_ability = ::Ability.new(user)

    deleted_documents = []
    departments.with_discarded.flat_map do |dep|
      dep.directories.with_discarded.accessible_by(current_ability)
    end.each do |directory|
      deleted_documents << directory.documents.discarded.select(Document.attribute_names).accessible_by(current_ability)
    end

    deleted_documents.flatten
  end

  def create_default_reports
    DefaultReports.new(id).create_reports
  end

  def directories_paths(user)
    current_ability = ::Ability.new(user)
    directories_paths = []

    departments.accessible_by(current_ability).flat_map do |dep|
      dep.directories.accessible_by(current_ability)
    end.each do |directory|
      directories_paths << %I[#{directory.path} #{directory.id}]
    end

    directories_paths.sort
  end

  def active_users
    User.filter_by_organization_id(id).where('current_sign_in_at >= (?)', 10.minutes.ago)
  end

  private

  def service_name
    'printer_cloud'
  end

  def prn_resource_id
    cnpj
  end

  def ensure_valid_cnpj
    errors.add(:cnpj, message: I18n.t('activerecord.errors.messages.invalid')) unless valid_cnpj?
  end

  def valid_cnpj?
    CNPJ.valid?(cnpj)
  end

  def format_cnpj
    self.cnpj = Formatters.remove_non_numeric(cnpj) unless cnpj.nil?
  end

  def procedure_attachments_used_storage
    query = <<-SQL
    SELECT SUM(byte_size)
    FROM active_storage_blobs
    JOIN active_storage_attachments
    ON active_storage_attachments.blob_id=active_storage_blobs.id
    JOIN procedure_attachments
    ON procedure_attachments.id=active_storage_attachments.record_id
    JOIN procedures
    ON procedures.id=procedure_attachments.procedure_id
    JOIN departments
    ON procedures.department_id=departments.id
    JOIN organizations
    ON departments.organization_id=organizations.id
    WHERE organizations.id=#{id}
    AND active_storage_attachments.record_type='Flow::ProcedureAttachment'
    SQL

    result = ActiveRecord::Base.connection.execute(query)
    result.getvalue(0, 0) || 0
  end

  def procedure_pdfs_used_storage
    query = <<-SQL
      SELECT SUM(byte_size)
      FROM active_storage_blobs
      JOIN active_storage_attachments
      ON active_storage_attachments.blob_id=active_storage_blobs.id
      JOIN procedure_pdfs
      ON procedure_pdfs.id=active_storage_attachments.record_id
      JOIN procedures
      ON procedures.id=procedure_pdfs.procedure_id
      JOIN departments
      ON procedures.department_id=departments.id
      JOIN organizations
      ON departments.organization_id=organizations.id
      WHERE organizations.id=#{id}
      AND active_storage_attachments.record_type='Flow::ProcedurePdf'
    SQL

    result = ActiveRecord::Base.connection.execute(query)
    result.getvalue(0, 0) || 0
  end

  def task_attachments_used_storage
    query = <<-SQL
      SELECT SUM(byte_size)
      FROM active_storage_blobs
      JOIN active_storage_attachments
      ON active_storage_attachments.blob_id=active_storage_blobs.id
      JOIN task_attachments
      ON task_attachments.id=active_storage_attachments.record_id
      JOIN tasks
      ON tasks.id=task_attachments.task_id
      JOIN procedures
      ON procedures.id=tasks.procedure_id
      JOIN departments
      ON departments.id=procedures.department_id
      JOIN organizations
      ON departments.organization_id=organizations.id
      WHERE organizations.id=#{id}
      AND active_storage_attachments.record_type='Flow::TaskAttachment'
    SQL

    result = ActiveRecord::Base.connection.execute(query)
    result.getvalue(0, 0) || 0
  end
end
