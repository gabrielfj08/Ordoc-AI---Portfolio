require "cpf_cnpj"

module Flow
  class Partaker < ApplicationRecord
    include AASM
    include Activable
    include Filterable
    include Orderable
    include Searchable

    self.searchable_fields = [:cpf_cnpj, :email, :name, :notes]

    def aasm_event_failed(event_name, old_state_name)
      raise Error::InvalidTransitionError
    end

    belongs_to :organization
    has_many :procedure_partakers, class_name: 'Flow::ProcedurePartaker'
    has_many :procedures, class_name: 'Flow::Procedure'

    has_many :procedure_beneficiaries, class_name: 'Flow::ProcedureBeneficiary', foreign_key: 'beneficiary_id'
    has_many :benefiting_procedures, through: :procedure_beneficiaries, source: :procedure

    has_many :procedure_requesters, class_name: 'Flow::ProcedureRequester', foreign_key: 'requester_id'
    has_many :requested_procedures, through: :procedure_requesters, source: :procedure

    before_validation :format_cpf_cnpj
    before_destroy :must_not_be_in_any_procedure
    
    validates :address, :cpf_cnpj, :email, :name, :organization_id, :phone, presence: true
    validates :cpf_cnpj, uniqueness: { scope: :organization_id }, if: -> { cpf_cnpj? }
    validates :email, email: true 
    validates :email, uniqueness: { scope: :organization_id }
    validates :phone, numericality: true
    validate :ensure_valid_cpf_cnpj, if: -> { cpf_cnpj? }

    scope :filter_by_cpf_cnpj, -> (cpf_cnpj) { where(cpf_cnpj: cpf_cnpj) }
    scope :filter_by_email, -> (email) { where(email: email) }
    scope :filter_by_name, -> (name) { where(name: name) }
    scope :filter_by_organization_id, -> (organization_id) { where(organization_id: organization_id) }
    scope :filter_by_status, -> (status) { where(status: status) }

    scope :search_by_cpf_cnpj, -> (cpf_cnpj) { where(Flow::Partaker.arel_table[:cpf_cnpj].matches( "%#{cpf_cnpj.gsub(/[-\/.]/, '')}%"  ) ) }
    scope :search_by_email, -> (email) { where(Flow::Partaker.arel_table[:email].matches("%#{email}%")) }
    scope :search_by_name, -> (name) { where(Flow::Partaker.arel_table[:name].matches("%#{name}%")) }
    scope :search_by_notes, -> (notes) { where(Flow::Partaker.arel_table[:notes].matches("%#{notes}%")) }

    private

    def must_not_be_in_any_procedure
      raise Error::PartakerMustNotBeInAnyProcedureError unless is_not_referenced_in_any_procedure?
    end

    def is_not_referenced_in_any_procedure?
      self.benefiting_procedures.count == 0 && self.requested_procedures.count == 0
    end

    def ensure_valid_cpf_cnpj
      errors.add(:cpf_cnpj, :invalid) unless valid_cpf_cnpj?
    end

    def valid_cpf_cnpj?
      CPF.valid?(cpf_cnpj) || CNPJ.valid?(cpf_cnpj)
    end

    def format_cpf_cnpj
      self.cpf_cnpj = Formatters.remove_non_numeric(cpf_cnpj) if cpf_cnpj.present?
    end
  end
end
