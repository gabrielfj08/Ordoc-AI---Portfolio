class Document < ApplicationRecord
  default_scope { current }
  include ActionView::Helpers::NumberHelper
  include AASM
  include Discard::Model
  include Filterable
  include Orderable
  include Searchable
  include Trashable
  include Prnable
  include PgSearch::Model

  @@sns_client = Aws::SNS::Client.new(credentials: PrinterCloud::Aws.credentials)

  def self.sns_client=(client)
    @@sns_client = client
  end

  self.discard_column = :deleted_at
  self.searchable_fields = %i[original_filename location description]

  STATUSES = Hash(
    failed: -1,
    created: 0,
    enqueued: 1,
    processed: 2
  )

  # enum status: [:pending, :processed, :failed, :skipped]
  enum status: STATUSES
  aasm column: :status, enum: true do
    state :created, initial: true
    state :enqueued, :processed, :failed

    event :enqueue, after: Ocr::SchedulerV2 do
      transitions from: %i[created failed], to: :enqueued
    end

    event :process do
      transitions from: %i[enqueued failed], to: :processed
    end

    event :fail do
      transitions from: %i[enqueued failed], to: :failed
    end
  end

  before_validation :ensure_original_filename_has_valid_characters, on: %i[create update]
  before_validation :generate_prn

  validates :original_filename, presence: true
  validates :directory_id, presence: true, unless: :inbox_id
  validates :inbox_id, presence: true, unless: :directory_id
  validates :created_by_id, presence: true, on: :create
  validates :prn, uniqueness: { scope: :head_document_id }

  belongs_to :directory, optional: true
  belongs_to :department, optional: true
  belongs_to :recycle_bin, optional: true
  belongs_to :inbox, optional: true
  belongs_to :head_document, class_name: 'Document', foreign_key: 'head_document_id', optional: true
  belongs_to :created_by, class_name: 'User', foreign_key: 'created_by_id', optional: true
  belongs_to :updated_by, class_name: 'User', foreign_key: 'updated_by_id', optional: true
  belongs_to :deleted_by, class_name: 'User', foreign_key: 'deleted_by_id', optional: true

  has_many :old_versions_documents, class_name: 'Document', foreign_key: 'head_document_id',
                                    inverse_of: :head_document, dependent: :destroy
  has_one_attached :file
  has_one_attached :processed_file
  has_one_attached :public_file, service: :amazon_public
  has_many :permissions, dependent: :destroy
  has_many :pages, dependent: :destroy
  has_many :recent_documents, dependent: :destroy
  has_many :last_users_accessed, through: :recent_documents, source: :user
  has_one :organization, through: :department
  has_many :shareable_links, dependent: :destroy

  # Versions handler scopes
  scope :current, -> { where(head_document_id: nil) }
  scope :with_old_versions, -> { unscope(where: :head_document_id).kept }
  scope :old_versions, -> { with_old_versions.where.not(head_document_id: nil) }
  scope :filter_by_name, ->(name) { where(Document.kept.arel_table[:original_filename].matches("#{name}")) }
  scope :filter_by_created_at, lambda { |created_at_range|
    filter_by_created_at_gte(created_at_range[:gte])
      .filter_by_created_at_lte(created_at_range[:lte])
  }
  scope :filter_by_recycle_bin_id, ->(recycle_bin_id) { where(recycle_bin_id: recycle_bin_id) }
  scope :filter_by_created_at_gte, lambda { |created_at_gte|
                                     where('documents.created_at >= ?', created_at_gte) if created_at_gte.present?
                                   }
  scope :filter_by_created_at_lte, lambda { |created_at_lte|
                                     where('documents.created_at <= ?', created_at_lte) if created_at_lte.present?
                                   }

  scope :filter_by_updated_at, lambda { |updated_at_range|
    filter_by_updated_at_gte(updated_at_range[:gte])
      .filter_by_updated_at_lte(updated_at_range[:lte])
  }
  scope :filter_by_updated_at_gte, lambda { |updated_at_gte|
                                     where('documents.updated_at >= ?', updated_at_gte) if updated_at_gte.present?
                                   }
  scope :filter_by_updated_at_lte, lambda { |updated_at_lte|
                                     where('documents.updated_at <= ?', updated_at_lte) if updated_at_lte.present?
                                   }
  scope :filter_by_created_by_id, ->(created_by_id) { where(created_by_id: created_by_id) }
  scope :filter_by_updated_by_id, ->(updated_by_id) { where(updated_by_id: updated_by_id) }
  scope :filter_by_original_filename, lambda { |original_filename|
                                        where(Document.arel_table[:original_filename].matches("%#{original_filename}%"))
                                      }
  scope :filter_by_description, lambda { |description|
                                  where(Document.arel_table[:description].matches("%#{description}%"))
                                }
  scope :filter_by_location, ->(location) { where(Document.arel_table[:location].matches("%#{location}%")) }
  scope :filter_by_organization_id, lambda { |organization_id|
                                      joins(directory: :department).where(department: { organization_id: organization_id })
                                    }
  scope :filter_by_department_id, ->(department_id) { where(department_id: department_id) }
  scope :filter_by_reader_id, lambda { |user_id|
                                joins(:permissions).where(permissions: { scope: :reader, user_id: user_id })
                              }
  scope :filter_by_writer_id, lambda { |user_id|
                                joins(:permissions).where(permissions: { scope: :writer, user_id: user_id })
                              }
  scope :filter_by_shared_documents, lambda { |user_id|
                                       joins(:permissions).where(permissions: { scope: 0..2, user_id: user_id }).distinct
                                     }

  scope :search_by_original_filename, lambda { |query|
                                        where(Document.arel_table[:original_filename].matches("%#{query}%"))
                                      }
  scope :search_by_description,       ->(query) { where(Document.arel_table[:description].matches("%#{query}%")) }
  scope :search_by_location,          ->(query) { where(Document.arel_table[:location].matches("%#{query}%")) }

  after_commit :publish_document_created_event, on: :create
  after_commit :publish_document_updated_event, on: :update
  after_commit :publish_document_destroyed_event, on: :destroy

  after_trash do
    permissions.discard_all
    reattach
    public_file.purge if public_file.attached?
    old_versions_documents.discard_all
    recent_documents.discard_all
    shareable_links.destroy_all
  end

  after_untrash do
    permissions.undiscard_all
    old_versions_documents.undiscard_all
    recent_documents.undiscard_all
  end

  after_discard do
    permissions.discard_all
    reattach
    public_file.purge if public_file.attached?
    old_versions_documents.discard_all
    recent_documents.discard_all
    shareable_links.destroy_all
  end

  after_undiscard do
    permissions.undiscard_all
    old_versions_documents.undiscard_all
    recent_documents.undiscard_all
  end

  def url
    return unless current_file.attached?

    Rails.application.routes.url_helpers.rails_blob_path(current_file.attachment,
                                                         only_path: true)
  end

  def size
    number_to_human_size(current_file.attachment.byte_size) if current_file.attached?
  end

  def recyclable_bin
    directory.department.organization.recycle_bin
  end

  def with_old_versions
    Document.with_old_versions.where(id: [Document.with_old_versions.where(head_document_id: id).pluck(:id),
                                          id].flatten)
  end

  def old_versions
    Document.with_old_versions.where(head_document_id: id)
  end

  def is_current_version?
    !head_document_id?
  end

  def current_file
    if processed_file.attached?
      processed_file
    else
      file
    end
  end

  def has_previous_versions?
    Document.with_old_versions.where(head_document_id: id).pluck(:id).present?
  end

  def self.search(params)
    params.include?('&') ? search_and(params.gsub('&', ' ')) : search_or(params)
  end

  def move_to_root(user)
    root = Directory.where(name: 'Recuperado da lixeira', department: directory.department).first

    if root.nil?
      root = Directory.create!(
        name: 'Recuperado da lixeira',
        department: directory.department,
        description: 'Recuperado da lixeira',
        created_by: user
      )
    end

    update!(directory: root)
  end

  def path
    return '' if directory.nil?
    return "/#{inbox.user.name}" unless inbox.nil?

    path = []
    parent_directory = directory

    loop do
      path << parent_directory.name
      parent_directory.parent_directory.nil? ? break : parent_directory = parent_directory.parent_directory
    end

    path << parent_directory.department.name

    path.reverse.map { |word| "/#{word}" }.join
  end

  def move(path)
    update(path.to_attributes)
  end

  def truly_destroy!
    return raise Error::NotDeletedDocument unless discarded?

    destroy!
  end

  def shareable_link
    public_file.url if public_file.attached?
  end

  def reattach
    return unless file.attached?

    current_file.attach(io: StringIO.new(file.download), filename: file.filename,
                        content_type: file.content_type)
  end

  def reindex(collection = 'documents')
    @@sns_client.publish({
                           topic_arn: "arn:aws:sns:sa-east-1:698497033648:solr-#{ENV['RAILS_ENV']}",
                           message: {
                             'Payload' => {
                               'Id' => id,
                               'Collection' => collection
                             }
                           }.to_json,
                           message_attributes: {
                             'EventType' => {
                               data_type: 'String',
                               string_value: 'DocumentReindexed'
                             }
                           }
                         })
  end

  private

  def ensure_original_filename_has_valid_characters
    self.original_filename = Formatters.remove_slash(original_filename)
  end

  def generate_prn
    self.prn = if inbox.present?
                 "prn:#{service_name}::inbox#{original_filename}"
               else
                 "prn:#{service_name}:#{resource_organization}:#{prn_resource_id}"
               end
  end

  def service_name
    'printer_air'
  end

  def prn_resource_id
    "#{directory.path}/#{original_filename}"
  end

  def publish_document_created_event
    @@sns_client.publish({
                           topic_arn: "arn:aws:sns:sa-east-1:698497033648:solr-#{ENV['RAILS_ENV']}",
                           message: {
                             'Payload' => {
                               'Id' => id,
                               'Collection' => 'documents'
                             }
                           }.to_json,
                           message_attributes: {
                             'EventType' => {
                               data_type: 'String',
                               string_value: 'DocumentCreated'
                             }
                           }
                         })
  end

  def publish_document_updated_event
    @@sns_client.publish({
                           topic_arn: "arn:aws:sns:sa-east-1:698497033648:solr-#{ENV['RAILS_ENV']}",
                           message: {
                             'Payload' => {
                               'Id' => id,
                               'Collection' => 'documents'
                             }
                           }.to_json,
                           message_attributes: {
                             'EventType' => {
                               data_type: 'String',
                               string_value: 'DocumentUpdated'
                             }
                           }
                         })
  end

  def publish_document_destroyed_event
    @@sns_client.publish({
                           topic_arn: "arn:aws:sns:sa-east-1:698497033648:solr-#{ENV['RAILS_ENV']}",
                           message: {
                             'Payload' => {
                               'Id' => id,
                               'Collection' => 'documents'
                             }
                           }.to_json,
                           message_attributes: {
                             'EventType' => {
                               data_type: 'String',
                               string_value: 'DocumentDestroyed'
                             }
                           }
                         })
  end
end
