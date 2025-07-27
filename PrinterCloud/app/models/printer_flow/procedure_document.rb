module PrinterFlow
  class ProcedureDocument < ApplicationRecord
    include AASM
    include Filterable
    include Orderable

    self.table_name = 'printer_flow.procedure_documents'
    self.per_page = 10

    STATUSES = Hash(
      failed: -1,
      created: 0,
      running: 1,
      finished: 2
    )

    SOURCES = Hash(
      upload: 0,
      printer_air: 1
    )

    enum source: SOURCES
    enum status: STATUSES
    aasm column: :status, enum: true do
      state :created, initial: true
      state :running, :finished, :failed

      event :run, after: :enqueue_job do
        transitions from: %i[created failed], to: :running
      end

      event :finish, after: :sync_document_name do
        transitions from: %i[running failed], to: :finished
      end

      event :fail do
        transitions from: %i[running failed], to: :failed
      end
    end

    after_commit :run!, on: :create

    before_validation :generate_uuid, on: :create

    validates :s3_key, :key, :uuid, :name, presence: true
    validates :s3_key, :key, document_format: { in: Formatters::ALLOWED_EXTENSIONS }, if: lambda {
                                                                                            upload?
                                                                                          }, on: :create
    validates :name, format: { without: Regex::EMOJI }

    belongs_to :document, class_name: 'PrinterAir::Document', optional: true, dependent: :destroy
    belongs_to :signed_document, class_name: 'PrinterAir::Document', optional: true, dependent: :destroy
    belongs_to :procedure, class_name: 'PrinterFlow::Procedure'
    belongs_to :created_by, class_name: 'PrinterCloud::User'

    has_one :organization, through: :procedure

    has_many :signatures, as: :signable, class_name: 'PrinterSign::Signature', dependent: :destroy
    has_many :attachments, as: :attachable, class_name: 'PrinterFlow::TaskAttachment', dependent: :destroy

    scope :filter_by_source, ->(source) { where(source: source.map(&:to_sym) & SOURCES.keys) }
    scope :filter_by_status, ->(status) { where(status: status.map(&:to_sym) & STATUSES.keys) }

    def document_url
      if signed_document.nil?
        document.url unless document.nil?
      else
        signed_document.url
      end
    end

    private

    def enqueue_job
      if upload?
        PrinterFlow::DocumentUploadWorker.perform_async({ id: id, destination_directory_path: destination_directory_path,
                                                          class: self.class })
        true
      else
        PrinterFlow::DocumentUploadFromPrinterAirWorker.perform_async({ id: id, destination_directory_path: destination_directory_path,
                                                                        class: self.class })
        true
      end
    end

    def destination_directory_path
      if !procedure.private?
        "Printer Flow/#{procedure.procedure_template.name}/#{procedure.process_number.gsub('/', '-')}/Anexos"
      elsif procedure.external?
        "Printer Flow - Private/Flow Cidadão/#{procedure.procedure_template.name}/#{procedure.process_number.gsub('/',
                                                                                                                  '-')}/Anexos"
      else
        "Printer Flow - Private/#{procedure.procedure_template.name}/#{procedure.process_number.gsub('/', '-')}/Anexos"
      end
    end

    def generate_uuid
      self.uuid = SecureRandom.uuid
    end

    def sync_document_name
      update!(name: document.original_filename)
    end
  end
end
