module PrinterFlow
  class TaskAttachment < ApplicationRecord
    include Orderable
    include Filterable

    self.table_name = 'printer_flow.task_attachments'
    self.per_page = 10

    belongs_to :attachable, polymorphic: true
    belongs_to :task, class_name: 'PrinterFlow::Task'
    belongs_to :created_by, class_name: 'PrinterFlow::Requester'

    has_one :procedure, class_name: 'PrinterFlow::Procedure', through: :task
    has_many :signatures, class_name: 'PrinterSign::Signature', through: :procedure

    validates :attachable_id, uniqueness: { scope: %i[task_id attachable_type] }

    scope :filter_by_task_id, ->(task_id) { where(task_id: task_id) }
    scope :filter_by_attachable_type, ->(attachable_type) { where(attachable_type: attachable_type) }
    scope :filter_by_attachable_id, ->(attachable_id) { where(attachable_id: attachable_id) }
  end
end
