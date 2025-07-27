require 'aws-sdk-s3'

module PrinterAir
  class Document < ApplicationRecord
    include ActionView::Helpers::NumberHelper
    include AASM
    include Discard::Model
    include Filterable
    include Orderable
    include Prnable

    @@sns_client = Aws::SNS::Client.new(credentials: PrinterCloud::Aws.credentials)
    @@s3_client = Aws::S3::Client.new(credentials: PrinterCloud::Aws.credentials)

    def self.sns_client=(client)
      @@sns_client = client
    end

    def self.s3_client=(client)
      @@s3_client = client
    end

    self.discard_column = :deleted_at
    self.table_name = :documents
    self.per_page = 10

    STATUSES = Hash(
      failed: -1,
      created: 0,
      enqueued: 1,
      processed: 2
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :created, initial: true
      state :enqueued, :processed, :failed

      event :enqueue, after: Ocr::SchedulerV3 do
        transitions from: %i[created enqueued failed processed], to: :enqueued
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

    validates :original_filename, :directory_id, presence: true
    validates :created_by_id, :updated_by_id, presence: true, on: :create
    validates :prn, uniqueness: { scope: :version_id }

    belongs_to :directory, class_name: 'PrinterAir::Directory'
    belongs_to :created_by, class_name: 'PrinterCloud::User', foreign_key: 'created_by_id', optional: true
    belongs_to :updated_by, class_name: 'PrinterCloud::User', foreign_key: 'updated_by_id', optional: true
    belongs_to :deleted_by, class_name: 'PrinterCloud::User', foreign_key: 'deleted_by_id', optional: true

    has_one :external_procedure_report, class_name: 'PrinterFlow::External::ProcedureReport',
                                        foreign_key: 'document_id', dependent: :destroy
    has_one :procedure_report, class_name: 'PrinterFlow::ProcedureReport', foreign_key: 'document_id',
                               dependent: :destroy
    has_one :procedure_document, class_name: 'PrinterFlow::ProcedureDocument',
                                 foreign_key: 'document_id'
    has_one :task_document, class_name: 'PrinterFlow::TaskDocument',
                            foreign_key: 'document_id'

    has_many :shared_objects, class_name: 'PrinterAir::SharedObject', primary_key: 'prn', foreign_key: 'object_prn',
                              dependent: :destroy
    has_many :pages, dependent: :destroy
    has_many :recent_documents, class_name: 'PrinterAir::RecentDocument',
                                dependent: :destroy
    has_many :document_copies, class_name: 'PrinterAir::DocumentCopy', dependent: :destroy
    has_many :document_version_upload_job, class_name: 'PrinterAir::DocumentVersionUploadJob', dependent: :destroy

    has_one_attached :file
    has_one_attached :processed_file
    has_one_attached :public_file, service: :amazon_public

    has_one :organization, through: :directory

    alias_attribute :name, :original_filename

    scope :filter_by_directory_id, ->(directory_id) { where(directory_id: directory_id) }

    scope :filter_by_prn, ->(prn) { where('documents.prn = ?', prn) }
    scope :current, -> { where(version_id: nil) }
    scope :non_current, -> { where.not(version_id: nil) }

    after_commit :publish_document_created_event, on: :create
    after_commit :publish_document_updated_event, on: :update
    after_commit :publish_document_destroyed_event, on: :destroy

    after_create_commit :share_document, if: -> { directory.shared? }

    before_update :share_document, if: :can_be_moved?

    def shared?
      shared_objects.exists?
    end

    def has_link?
      shareable_links.present?
    end

    def shareable_links
      PrinterAir::ShareableLink.not_expired.where(document_prn: prn)
    end

    def size
      number_to_human_size(current_file.attachment.byte_size) if current_file.attached?
    end

    def byte_size
      current_file.attachment.byte_size if current_file.attached?
    end

    def current_file
      if processed_file.attached?
        processed_file
      else
        file
      end
    end

    def versions
      self.class.where(prn: prn)
    end

    def current?
      !version_id
    end

    def path
      return '' if directory.nil?

      path = []
      parent_directory = directory
      path << original_filename

      loop do
        path << parent_directory.name
        parent_directory.parent_directory.nil? ? break : parent_directory = parent_directory.parent_directory
      end

      path.reverse.map { |word| "/#{word}" }.join
    end

    def url
      return unless current_file.attached?

      Rails.application.routes.url_helpers.rails_blob_path(current_file.attachment,
                                                           only_path: true)
    end

    def download_url
      signer = Aws::S3::Presigner.new(client: @@s3_client)

      return unless current_file.present?

      signer.presigned_url(:get_object, bucket: ENV['AWS_BUCKET'], key: current_file.attachment.key,
                                        expires_in: 300, response_content_disposition: "attachment; filename=\"#{original_filename}\"")
    end

    def reindex(collection = ENV['SOLR_COLLECTION'])
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

    def can_be_moved?
      !status_changed? && directory_id_changed? && directory.shared? || !status_changed? && prn_changed? && !original_filename_changed?
    end

    def share_document
      ::PrinterAir::DocumentShareWorker.perform_async(id)
    end

    def ensure_original_filename_has_valid_characters
      self.original_filename = Formatters.remove_slash(original_filename)
    end

    def prn_resource_id
      "#{directory.path.delete_prefix('/')}/#{original_filename}"
    end

    def publish_document_created_event
      @@sns_client.publish({
                             topic_arn: "arn:aws:sns:sa-east-1:698497033648:solr-#{ENV['RAILS_ENV']}",
                             message: {
                               'Payload' => {
                                 'Id' => id,
                                 'Collection' => ENV['SOLR_COLLECTION']
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
                                 'Collection' => ENV['SOLR_COLLECTION']
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
                                 'Collection' => ENV['SOLR_COLLECTION']
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
end
