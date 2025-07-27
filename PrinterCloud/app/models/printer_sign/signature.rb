module PrinterSign
  class Signature < ApplicationRecord
    include AASM
    include Orderable
    include Filterable
    include Searchable

    self.searchable_fields = %i[token]
    self.table_name = 'printer_sign.signatures'
    self.per_page = 10

    STATUSES = Hash(
      failed: -1,
      created: 0,
      running: 1,
      signed: 2,
      refused: 3
    )

    SERVICES = Hash(
      printer_flow: 0
    )

    enum status: STATUSES
    enum service: SERVICES

    aasm column: :status, enum: true do
      state :created, initial: true
      state :running, :signed, :refused

      event :run, after: :enqueue_job do
        transitions from: :created, to: :running
      end

      event :sign do
        transitions from: %i[failed running], to: :signed
      end

      event :refuse do
        transitions from: :created, to: :refused
      end

      event :fail do
        transitions from: %i[created running failed], to: :failed
      end
    end

    after_create_commit lambda {
      if procedure.external? && requester.is_a?(PrinterFlow::ExternalRequester)
        notify('send_signature_created_notification')
      end
    }

    before_validation :generate_token, on: :create

    before_destroy :ensure_signature_is_not_signed

    validates :service, :token, presence: true
    validates :requester, uniqueness: { scope: %i[signable_type signable_id] }

    validates_with SignatureValidator, on: %i[create]

    belongs_to :requester, class_name: 'PrinterFlow::Requester'
    belongs_to :created_by, class_name: 'PrinterCloud::User'
    belongs_to :procedure, class_name: 'PrinterFlow::Procedure'

    has_one :self_ref, class_name: 'PrinterSign::Signature', foreign_key: :id

    belongs_to :signable, polymorphic: true
    has_one :procedure_document, through: :self_ref, source: :signable, source_type: 'PrinterFlow::ProcedureDocument'
    has_one :task_document, through: :self_ref, source: :signable, source_type: 'PrinterFlow::TaskDocument'
    has_one :organization, through: :procedure
    has_one :user, class_name: 'PrinterCloud::User', through: :requester

    has_many :justification_notes, as: :justifiable, class_name: 'PrinterFlow::JustificationNote'

    scope :filter_by_status, ->(status) { where(status: status.map(&:to_sym) & STATUSES.keys) }
    scope :filter_by_requester_id, ->(requester_id) { where(requester_id: requester_id) }
    scope :filter_by_signable_type, ->(signable_type) { where(signable_type: signable_type) }
    scope :filter_by_signable_id, ->(signable_id) { where(signable_id: signable_id) }
    scope :filter_by_created_by_id, ->(created_by_id) { where(created_by_id: created_by_id) }
    scope :filter_by_procedure_id, ->(procedure_id) { where(procedure_id: procedure_id) }
    scope :filter_by_user_id, lambda { |user_id|
                                joins(requester: :users).where(user: { id: user_id })
                              }
    scope :filter_by_created_at, lambda { |created_at_range|
                                   filter_by_created_at_gte(created_at_range[:gte])
                                     .filter_by_created_at_lte(created_at_range[:lte])
                                 }
    scope :filter_by_created_at_gte, lambda { |created_at_gte|
                                       begin
                                         if created_at_gte.present?
                                           Date.parse(created_at_gte)
                                           where('printer_sign.signatures.created_at >= ?', created_at_gte)
                                         end
                                       rescue Date::Error
                                         raise Error::PrinterFlow::InvalidDate
                                       end
                                     }
    scope :filter_by_created_at_lte, lambda { |created_at_lte|
                                       begin
                                         if created_at_lte.present?
                                           Date.parse(created_at_lte)
                                           where('printer_sign.signatures.created_at <= ?', created_at_lte)
                                         end
                                       rescue Date::Error
                                         raise Error::PrinterFlow::InvalidDate
                                       end
                                     }
    scope :search_by_token, lambda { |query|
                              where(arel_table[:token].matches("%#{query}%"))
                            }

    def self.count_by_status(user)
      signatures = filter_by_requester_id(user.internal_requester.id)
                   .group(:status)
                   .count

      { 'created': signatures['created'].to_i,
        'signed': signatures['signed'].to_i + signatures['running'].to_i,
        'refused': signatures['refused'].to_i }
    end

    def notify(method)
      if requester.sms?
        PrinterFlow::ExternalRequesterNotifierSms.public_send(method, requester, self)
      else
        ExternalRequesterNotifierMailer.public_send(method, requester, self).deliver
      end
    end

    private

    def enqueue_job
      ::PrinterFlow::SignatureWorker.perform_async(id)
      true
    end

    def generate_token
      self.token = SecureRandom.uuid
    end

    def ensure_signature_is_not_signed
      return if created? || refused? || task_is_draft?

      raise Error::CustomError.new(:unprocessable_entity, 422,
                                   I18n.t('activerecord.errors.messages.signature_must_be_pending'))
    end

    def task_is_draft?
      return true if signable_type == 'PrinterFlow::TaskDocument' && signable.task.status == 'draft'

      raise Error::CustomError.new(:unprocessable_entity, 422,
                                   I18n.t('printer_flow.errors.messages.task_of_task_document_must_be_in_draft'))
    end
  end
end
