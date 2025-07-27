module PrinterFlow
  class Procedure < ApplicationRecord
    include AASM
    include Orderable
    include Filterable
    include Searchable
    include Prnable

    self.table_name = 'printer_flow.procedures'
    self.per_page = 10
    self.searchable_fields = %i[process_number procedure_template_name]

    SOURCES = Hash(
      internal: 0,
      external: 1
    )

    PRIORITIES = Hash(
      normal: 0,
      high: 1
    )

    STATUSES = Hash(
      draft: 0,
      running: 1,
      started: 2,
      finished: 3,
      archived: 4
    )

    enum source: SOURCES
    enum priority: PRIORITIES
    enum status: STATUSES

    aasm column: :status, enum: true do
      state :draft, initial: true
      state :running, :started, :finished, :archived

      event :draft do
        transitions from: :archived, to: :draft
      end

      event :run, before: :ensure_procedure_payload_has_values_if_schema_is_present do
        transitions from: %i[draft], to: :running
      end

      event :start do
        transitions from: %i[archived running], to: :started
      end

      event :finish, before: :ensure_procedure_can_be_finished do
        transitions from: :started, to: :finished
      end

      event :archive, before: :ensure_procedure_can_be_archived do
        transitions from: %i[draft started], to: :archived
      end
    end

    before_validation :generate_process_number, on: :create
    before_validation :generate_prn, on: :create
    before_validation :check_procedure_documents_uuid, on: :update

    before_create :set_procedure_template_name
    before_create :ensure_group_requester_is_active

    validates :priority, :process_number, presence: true
    validates :payload, presence: true, on: :update, unless: -> { schema.blank? || status_changed? }
    validates :payload, array: { presence: true, each_field: true }
    validates :process_number, uniqueness: { scope: :procedure_template }
    validates :payload, :priority, :responsible_group, :private, :requester,
              :deadline, :schema, :procedure_template, not_frozen: true, on: :update, unless: lambda {
                                                                                                status_changed?
                                                                                              }
    validates :payload, format: { without: Regex::EMOJI }
    validates :deadline, comparison: { greater_than_or_equal_to: Date.today }, if: -> { deadline_changed? }

    validates_with ProcedureValidator

    belongs_to :procedure_template, class_name: 'PrinterFlow::ProcedureTemplate', foreign_key: 'procedure_template_id'
    belongs_to :requester, class_name: 'PrinterFlow::Requester'
    belongs_to :responsible_group, class_name: 'PrinterFlow::GroupRequester'
    belongs_to :created_by, class_name: 'PrinterCloud::User'
    belongs_to :organization

    has_many :fields, through: :procedure_template
    has_many :procedure_documents, class_name: 'PrinterFlow::ProcedureDocument', dependent: :destroy
    has_many :justification_notes, as: :justifiable, class_name: 'PrinterFlow::JustificationNote'
    has_many :tasks, class_name: 'PrinterFlow::Task'
    has_many :task_documents, through: :tasks
    has_many :procedure_reports, class_name: 'PrinterFlow::ProcedureReport'
    has_many :external_procedure_reports, class_name: 'PrinterFlow::External::ProcedureReport', dependent: :destroy
    has_many :signatures, class_name: 'PrinterSign::Signature', foreign_key: 'procedure_id'
    has_many :shared_procedures, class_name: 'PrinterFlow::External::SharedProcedure', dependent: :destroy
    has_many :task_attachments, class_name: 'PrinterFlow::TaskAttachment', through: :tasks, source: 'attachments'

    scope :filter_by_status, lambda { |status|
                               where(status: status.map(&:to_sym) & STATUSES.keys)
                             }
    scope :filter_by_source, lambda { |source|
                               where(source: source.map(&:to_sym) & SOURCES.keys)
                             }
    scope :filter_by_priority, lambda { |priority|
                                 where(priority: priority.map(&:to_sym) & PRIORITIES.keys)
                               }
    scope :filter_by_private, lambda { |private|
                                where(private: private.map(&:to_sym) & %i[true false])
                              }
    scope :filter_by_created_by_id, ->(created_by_id) { where(created_by_id: created_by_id) }
    scope :filter_by_responsible_group_id, lambda { |responsible_group_id|
                                             where(responsible_group_id: responsible_group_id)
                                           }

    scope :filter_by_requester_id, lambda { |requester_id|
                                     where(requester_id: requester_id)
                                   }
    scope :filter_by_created_at, lambda { |created_at_range|
                                   filter_by_created_at_gte(created_at_range[:gte])
                                     .filter_by_created_at_lte(created_at_range[:lte])
                                 }
    scope :filter_by_created_at_gte, lambda { |created_at_gte|
                                       begin
                                         if created_at_gte.present?
                                           Date.parse(created_at_gte)
                                           where('printer_flow.procedures.created_at >= ?', created_at_gte)
                                         end
                                       rescue Date::Error
                                         raise Error::PrinterFlow::InvalidDate
                                       end
                                     }
    scope :filter_by_created_at_lte, lambda { |created_at_lte|
                                       begin
                                         if created_at_lte.present?
                                           Date.parse(created_at_lte)
                                           where('printer_flow.procedures.created_at <= ?', created_at_lte)
                                         end
                                       rescue Date::Error
                                         raise Error::PrinterFlow::InvalidDate
                                       end
                                     }
    scope :filter_by_shared_with_requester_id, lambda { |shared_with_requester_id|
                                                 joins(:shared_procedures).where(shared_procedures: { status: :accepted, external_requester_id: shared_with_requester_id })
                                               }

    scope :search_by_process_number, lambda { |query|
                                       where(arel_table[:process_number].matches("%#{query}%"))
                                     }

    scope :search_by_procedure_template_name, lambda { |query|
                                                where(arel_table[:procedure_template_name].matches("%#{query}%"))
                                              }
    scope :visible, -> { where(private: false) }

    def notify(method)
      if requester.sms?
        PrinterFlow::ExternalRequesterNotifierSms.public_send(method, requester, self)
      else
        ExternalRequesterNotifierMailer.public_send(method, requester, self).deliver
      end
    end

    def unarchive!
      tasks.where.not(status: :draft).count.positive? ? start! : draft!
    end

    def finish(user)
      finish!
      justification_notes.create!(
        note: finish_note(user),
        action: 'finish',
        created_by_id: user.internal_requester.id
      )
    end

    def closed?
      archived? || finished?
    end

    def self.count_by_status
      procedures = group(:status).count

      { 'draft': procedures['draft'].to_i,
        'running': procedures['running'].to_i,
        'started': procedures['started'].to_i,
        'finished': procedures['finished'].to_i,
        'archived': procedures['archived'].to_i }
    end

    private

    def ensure_procedure_payload_has_values_if_schema_is_present
      raise Error::PrinterFlow::PayloadIsNotFullyFilled if schema.present? && payload.blank?
    end

    def ensure_procedure_can_be_archived
      return unless (tasks.pluck(:status) & %w[running draft
                                               started]) != [] || signatures.pluck(:status).include?('created')

      raise Error::CustomError.new(:unprocessable_entity, 422,
                                   I18n.t('activerecord.errors.messages.task_must_be_finished'))
    end

    def ensure_procedure_can_be_finished
      if tasks.count == tasks.refused.count

        raise Error::CustomError.new(:unprocessable_entity, 422,
                                     I18n.t('activerecord.errors.messages.procedure_need_accepted_tasks_to_finish'))

      elsif (tasks.pluck(:status) & %w[running draft
                                       started]) != [] || signatures.pluck(:status).include?('created')

        raise Error::CustomError.new(:unprocessable_entity, 422,
                                     I18n.t('activerecord.errors.messages.task_must_be_finished'))
      end
    end

    def set_procedure_template_name
      self.procedure_template_name = procedure_template.name
    end

    def prn_resource_id
      "#{procedure_template.name}/#{process_number}"
    end

    def generate_process_number
      all_procedures = []
      if procedure_template.parent_procedure_template_id?
        PrinterFlow::ProcedureTemplate.where('prn ilike ?',
                                             "#{procedure_template.parent_procedure_template.prn}%").each do |procedure_template|
          if procedure_template.procedures != []
            all_procedures << procedure_template.procedures.where('process_number ilike ?',
                                                                  "%#{Time.now.year}").last.process_number.to_i
          end
        end
      else
        PrinterFlow::ProcedureTemplate.where('prn ilike ?',
                                             "#{procedure_template.prn}%").each do |procedure_template|
          if procedure_template.procedures != []
            all_procedures << procedure_template.procedures.where('process_number ilike ?',
                                                                  "%#{Time.now.year}").last.process_number.to_i
          end
        end
      end

      sequential_number = (all_procedures.flatten.max || 0) + 1
      self.process_number = "#{sequential_number}/#{Time.now.year}"
    end

    def finish_note(user)
      "Processo finalizado por #{user.internal_requester.name}, cpf: #{DataMask.mask_cpf(user.cpf)}, no dia #{Date.current.strftime('%d/%m/%Y')}, às #{Time.now.in_time_zone('America/Sao_Paulo').strftime('%Hh%M')}"
    end

    def ensure_group_requester_is_active
      return if responsible_group.active?

      raise Error::CustomError.new(:unprocessable_entity, 422,
                                   I18n.t('activerecord.errors.messages.group_must_be_active'))
    end

    def check_procedure_documents_uuid
      uuids = procedure_documents.pluck(:uuid)
      mapped_payload = payload.map do |payload|
        next unless payload['field_type'] == 'attachment'

        payload['value'] = payload['value'].select do |item|
          item if uuids.include?(item)
        end
      end
      payload = mapped_payload
    end
  end
end
