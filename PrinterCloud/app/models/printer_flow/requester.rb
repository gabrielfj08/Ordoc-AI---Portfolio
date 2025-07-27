module PrinterFlow
  class Requester < ApplicationRecord
    include AASM
    include Activable
    include Orderable
    include Filterable
    include Searchable
    include Prnable

    self.searchable_fields = %i[cpf_cnpj email name]
    self.table_name = 'printer_flow.requesters'
    self.per_page = 10

    validates :type, :name, presence: true

    belongs_to :organization
    has_one :address, as: :addressable

    has_many :justification_notes, as: :justifiable, class_name: 'PrinterFlow::JustificationNote'
    has_many :requester_assignments, class_name: 'PrinterFlow::RequesterAssignment', foreign_key: :requester_id,
                                     dependent: :destroy
    has_many :users, class_name: 'PrinterCloud::User', through: :requester_assignments
    has_many :signatures, class_name: 'PrinterSign::Signature'
    has_many :requester_infos, class_name: 'PrinterFlow::RequesterInfo', dependent: :destroy
    has_many :procedures, class_name: 'PrinterFlow::Procedure'

    scope :not_internal, lambda {
                           where.not(type: 'PrinterFlow::InternalRequester')
                         }
    scope :filter_by_status, ->(status) { where(status: status) }
    scope :filter_by_type, lambda { |type|
                             where(type: type.map(&:to_sym))
                           }
    scope :filter_by_user_id, lambda { |user_id|
                                joins(:requester_assignments).where(requester_assignments: { user_id: user_id })
                              }
    scope :filter_by_parent_group_id, lambda { |parent_group_id|
                                        where(parent_group_id: parent_group_id, type: 'PrinterFlow::GroupRequester')
                                      }
    scope :filter_by_procedure_id, lambda { |procedure_id|
                                     joins(:procedures).where(procedures: { id: procedure_id })
                                   }

    scope :search_by_name,        lambda { |query|
                                    where(arel_table[:name].matches("%#{query}%"))
                                  }
    scope :search_by_email,       lambda { |query|
                                    where(arel_table[:email].matches("%#{query}%"))
                                  }
    scope :search_by_cpf_cnpj, lambda { |query|
                                 where(arel_table[:cpf_cnpj].matches("%#{query.gsub(%r{[-/.]}, '')}%"))
                               }

    def procedures_count
      procedures.count
    end
  end
end
