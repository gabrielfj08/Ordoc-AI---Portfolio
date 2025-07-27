module PrinterFlow
  class Task < ApplicationRecord
    include AASM
    include Orderable
    include Filterable
    include Searchable
    include Prnable

    self.table_name = 'printer_flow.tasks'
    self.per_page = 10
    self.searchable_fields = %i[name]

    PRIORITIES = Hash(
      normal: 0,
      high: 1
    )

    STATUSES = Hash(
      draft: 0,
      running: 1,
      started: 2,
      finished: 3,
      refused: 4
    )

    enum priority: PRIORITIES
    enum status: STATUSES

    aasm column: :status, enum: true, skip_validation_on_save: true do
      state :draft, initial: true
      state :running, :started, :finished, :refused

      event :run, after: :run_procedure! do
        after do
          notify('send_task_created_for_requester_notification') if group_assignee.is_a?(PrinterFlow::ExternalRequester)
        end

        transitions from: %i[running draft started], to: :running
      end

      event :start, before: :ensure_assignee_belongs_to_group, after: :start_procedure! do
        transitions from: :running, to: :started
      end

      event :finish, before: :ensure_task_has_comment_or_task_fields_are_filled do
        transitions from: :started, to: :finished
      end

      event :refuse, before: :ensure_assignee_belongs_to_group do
        after do
          start_procedure!
          if procedure.external? && created_by_id == ENV['EXTERNAL_USER_ID'].to_i
            notify('send_task_refused_by_internal_requester_notification')
          end
        end

        transitions from: :running, to: :refused
      end
    end

    before_validation :generate_prn
    before_validation :ensure_task_is_not_closed

    before_update :ensure_task_is_draft

    before_commit :ensure_task_is_draft, on: :destroy

    validates :name, :description, presence: true
    validates :name, uniqueness: { scope: :procedure }
    validates :name, :description, format: { without: Regex::EMOJI }
    validates :deadline, comparison: { greater_than_or_equal_to: Date.today }, if: -> { deadline_changed? }

    validates_with TaskValidator

    belongs_to :assignee, class_name: 'PrinterFlow::Requester', optional: true, foreign_key: 'assignee_id'
    belongs_to :group_assignee, class_name: 'PrinterFlow::Requester', optional: true,
                                foreign_key: 'group_assignee_id'
    belongs_to :created_by, class_name: 'PrinterCloud::User', foreign_key: 'created_by_id'
    belongs_to :procedure, class_name: 'PrinterFlow::Procedure', foreign_key: 'procedure_id'
    belongs_to :task_template, class_name: 'PrinterFlow::TaskTemplate', optional: true

    has_one :organization, through: :procedure

    has_many :justification_notes, as: :justifiable, class_name: 'PrinterFlow::JustificationNote'
    has_many :task_documents, class_name: 'PrinterFlow::TaskDocument', dependent: :destroy
    has_many :task_comments, class_name: 'PrinterFlow::TaskComment', dependent: :destroy
    has_many :task_fields, as: :fieldable, class_name: 'PrinterFlow::TaskField', dependent: :destroy
    has_many :attachments, class_name: 'PrinterFlow::TaskAttachment', dependent: :destroy

    alias comments task_comments

    scope :search_by_name, lambda { |query|
                             where(arel_table[:name].matches("%#{query}%"))
                           }
    scope :filter_by_procedure_id, lambda { |procedure_id|
                                     where(procedure_id: procedure_id)
                                   }
    scope :filter_by_assignee_id, lambda { |assignee_id|
                                    where(assignee_id: assignee_id)
                                  }
    scope :filter_by_group_assignee_id, lambda { |group_assignee_id|
                                          where(group_assignee_id: group_assignee_id)
                                        }
    scope :filter_by_created_by_id, lambda { |created_by_id|
                                      where(created_by_id: created_by_id)
                                    }
    scope :filter_by_procedure_requester_id, lambda { |procedure_requester_id|
                                               joins(:procedure).where(procedure: { requester_id: procedure_requester_id })
                                             }
    scope :filter_by_status, lambda { |status|
                               where(status: status.map(&:to_sym) & STATUSES.keys)
                             }
    scope :filter_by_priority, lambda { |priority|
                                 where(priority: priority.map(&:to_sym) & PRIORITIES.keys)
                               }

    def procedure_info
      task_infos = prn.split(':').last

      procedure_template_name, procedure_number, procedure_year = task_infos.split('/')

      "#{procedure_number}/#{procedure_year} - #{procedure_template_name}"
    end

    def self.count_by_status(user, user_group_id)
      running_tasks = running
                      .filter_by(group_assignee_id: user_group_id)
                      .count

      self_tasks = filter_by_assignee_id(user.internal_requester.id)
                   .filter_by(group_assignee_id: user_group_id)
                   .group(:status)
                   .count

      returned_tasks = filter_by(created_by_id: user.id).refused.count

      { 'running': running_tasks.to_i,
        'started': self_tasks['started'].to_i,
        'finished': self_tasks['finished'].to_i + self_tasks['refused'].to_i,
        'returned': returned_tasks.to_i }
    end

    def notify(method)
      if procedure.requester.sms?
        PrinterFlow::ExternalRequesterNotifierSms.public_send(method, procedure.requester, self)
      else
        ExternalRequesterNotifierMailer.public_send(method, procedure.requester, self).deliver
      end
    end

    private

    def ensure_task_has_comment_or_task_fields_are_filled
      if !task_fields.empty?
        task_fields.each do |task_field|
          if task_field.array_values.empty? && task_field.value.nil?
            raise Error::CustomError.new(:unprocessable_entity, 422,
                                         I18n.t('activerecord.errors.messages.task_has_task_fields_filled'))
          end
        end
      else
        return if comments.exists?

        raise Error::CustomError.new(:unprocessable_entity, 422,
                                     I18n.t('activerecord.errors.messages.task_has_attachment_or_comment'))
      end
    end

    def start_procedure!
      procedure.start! unless procedure.started?
    end

    def run_procedure!
      procedure.run! unless procedure.running? || procedure.started?
    end

    def ensure_assignee_belongs_to_group
      return if group_assignee.instance_of?(PrinterFlow::ExternalRequester)
      return if group_assignee.internal_requesters.include? assignee

      raise Error::CustomError.new(:unprocessable_entity, 422,
                                   I18n.t('activerecord.errors.messages.must_be_in_group_assignee'))
    end

    def closed?
      finished? || refused?
    end

    def ensure_task_is_not_closed
      return unless closed?

      errors.add(:status,
                 I18n.t('activerecord.errors.messages.task_already_ended'))
    end

    def ensure_task_is_draft
      return if draft? || group_assignee_id_changed? || assignee_id_changed?

      raise Error::CustomError.new(:unprocessable_entity, 422,
                                   I18n.t('activerecord.errors.messages.task_can_not_be_edited_or_deleted'))
    end

    def prn_resource_id
      "#{procedure.procedure_template_name}/#{procedure.process_number}/#{name}"
    end
  end
end
