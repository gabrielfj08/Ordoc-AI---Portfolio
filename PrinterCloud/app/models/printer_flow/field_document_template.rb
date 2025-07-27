module PrinterFlow
  class FieldDocumentTemplate < ApplicationRecord
    include AASM
    include Orderable
    include Searchable
    include Filterable

    self.searchable_fields = [:name]
    self.per_page = 10

    STATUSES = Hash(
      failed: -1,
      created: 0,
      running: 1,
      finished: 2
    )

    enum status: STATUSES
    aasm column: :status, enum: true do
      state :created, initial: true
      state :running, :finished, :failed

      event :run, after: :enqueue_job do
        transitions from: %i[created failed], to: :running
      end

      event :finish do
        transitions from: %i[running failed], to: :finished
      end

      event :fail do
        transitions from: %i[running failed], to: :failed
      end
    end

    after_commit :run!, on: :create

    validates :name, :s3_key, presence: true
    validates :name, uniqueness: { scope: :organization_id }
    belongs_to :organization
    belongs_to :document, class_name: 'PrinterAir::Document', optional: true, dependent: :destroy
    belongs_to :created_by, class_name: 'PrinterCloud::User', optional: true

    scope :filter_by_status, ->(status) { where(status: status.map(&:to_sym) & STATUSES.keys) }
    scope :search_by_name, lambda { |query|
                             where(arel_table[:name].matches("%#{query}%"))
                           }

    private

    def enqueue_job
      PrinterFlow::DocumentUploadWorker.perform_async({ id: id, destination_directory_path: 'Printer Flow/Modelos de Anexo',
                                                        class: self.class })
      true
    end
  end
end
