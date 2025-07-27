module PrinterFlow
  class TaskDocument < ApplicationRecord
    include AASM
    include Filterable
    include Orderable

    self.table_name = 'printer_flow.task_documents'
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

    before_create :ensure_task_is_draft_or_started

    validates :s3_key, :key, :s3_key, :name, presence: true
    validates :s3_key, :key, document_format: { in: Formatters::ALLOWED_EXTENSIONS }, if: lambda {
                                                                                            upload?
                                                                                          }, on: :create
    validates :name, format: { without: Regex::EMOJI }

    belongs_to :task, class_name: 'PrinterFlow::Task', touch: true
    belongs_to :created_by, class_name: 'PrinterCloud::User'
    belongs_to :document, class_name: 'PrinterAir::Document', optional: true, dependent: :destroy
    belongs_to :signed_document, class_name: 'PrinterAir::Document', optional: true, dependent: :destroy

    has_one :procedure, class_name: 'PrinterFlow::Procedure', through: :task, source: :procedure
    has_one :procedure_template, class_name: 'PrinterFlow::ProcedureTemplate', through: :procedure,
                                 source: :procedure_template
    has_one :organization, through: :task

    has_many :attachments, as: :attachable, class_name: 'PrinterFlow::TaskAttachment', dependent: :destroy
    has_many :signatures, as: :signable, class_name: 'PrinterSign::Signature', dependent: :destroy

    scope :filter_by_source, ->(source) { where(source: source.map(&:to_sym) & SOURCES.keys) }
    scope :filter_by_status, ->(status) { where(status: status.map(&:to_sym) & STATUSES.keys) }
    scope :filter_by_procedure_id, ->(procedure_id) { joins(:procedure).where(procedure: { id: procedure_id }) }
    scope :filter_by_task_id, lambda { |task_id|
      where(task_id: task_id)
    }
    scope :filter_by_task_assignee_id, ->(assignee_id) { joins(:task).where(task: { assignee_id: assignee_id }) }
    scope :filter_by_created_by_id, ->(created_by_id) { where(created_by_id: created_by_id) }

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
                                                                        class: self.class, key: key })
        true
      end
    end

    def destination_directory_path
      if !procedure.private?
        "Printer Flow/#{task.procedure.procedure_template.name}/#{task.procedure.process_number.gsub('/',
                                                                                                     '-')}/Tarefas/#{task.name}"
      elsif procedure.external?
        "Printer Flow - Private/Flow Cidadão/#{task.procedure.procedure_template.name}/#{task.procedure.process_number.gsub('/',
                                                                                                                            '-')}/Tarefas/#{task.name}"
      else
        "Printer Flow - Private/#{task.procedure.procedure_template.name}/#{task.procedure.process_number.gsub('/',
                                                                                                               '-')}/Tarefas/#{task.name}"
      end
    end

    def ensure_task_is_draft_or_started
      return if task.draft? || task.started?

      raise Error::CustomError.new(:unprocessable_entity, 422,
                                   I18n.t('activerecord.errors.messages.task_must_be_draft_or_started'))
    end

    def sync_document_name
      update!(name: document.original_filename)
    end

    def generate_uuid
      self.uuid = SecureRandom.uuid
    end
  end
end
