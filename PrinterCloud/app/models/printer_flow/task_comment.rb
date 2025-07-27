module PrinterFlow
  class TaskComment < ApplicationRecord
    include Orderable

    self.table_name = 'printer_flow.task_comments'

    before_commit :ensure_task_is_started

    validates :body, presence: true
    validates :body, format: { without: Regex::EMOJI }

    belongs_to :task, class_name: 'PrinterFlow::Task'
    belongs_to :created_by, class_name: 'PrinterFlow::Requester'

    private

    def ensure_task_is_started
      return if task.started?

      raise Error::CustomError.new(:unprocessable_entity, 422,
                                   I18n.t('activerecord.errors.messages.task_must_be_started'))
    end
  end
end
