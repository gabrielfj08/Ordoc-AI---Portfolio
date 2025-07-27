module PrinterFlow
  class GroupRequester < Requester
    self.searchable_fields = %i[code name]
    self.per_page = 10

    before_validation :generate_prn
    before_deactivate :must_not_be_in_procedure_template

    belongs_to :parent_group, optional: true, class_name: 'PrinterFlow::GroupRequester', foreign_key: 'parent_group_id'

    has_many :children_groups, class_name: 'PrinterFlow::GroupRequester', foreign_key: 'parent_group_id',
                               inverse_of: :parent_group
    alias groups children_groups
    alias children children_groups
    has_many :requester_assignments, class_name: 'PrinterFlow::RequesterAssignment', foreign_key: :requester_id,
                                     dependent: :destroy
    has_many :users, class_name: 'PrinterCloud::User', through: :requester_assignments
    has_many :internal_requesters, class_name: 'PrinterFlow::InternalRequester', through: :users
    has_many :procedure_templates, class_name: 'PrinterFlow::ProcedureTemplate'
    has_many :procedures, class_name: 'PrinterFlow::Procedure', foreign_key: :responsible_group_id
    has_many :group_requester_infos, dependent: :destroy

    validates :prn, presence: true, uniqueness: { scope: :parent_group_id }
    validates :code, uniqueness: { scope: :organization_id }

    scope :filter_by_user_id, lambda { |user_id|
                                joins(:requester_assignments).where(requester_assignments: { user_id: user_id })
                              }
    scope :search_by_code, lambda { |query|
                             where(arel_table[:code].matches("%#{query}%"))
                           }

    def user # To do: remove
      nil
    end

    def ancestor_group_tree
      group = self

      ancestor_group_tree_array = []

      loop do
        return ancestor_group_tree_array unless group.parent_group_id?

        ancestor_group_tree_array << { id: group.parent_group.id,
                                       name: group.parent_group.name,
                                       code: group.parent_group.code }

        group = group.parent_group
      end
    end

    private

    def must_not_be_in_procedure_template
      procedure_templates.each do |template|
        if !template.parent_procedure_template_id.nil? && template.active?
          raise Error::PrinterFlow::CannotDeactivateGroupError
        end
      end
    end

    def prn_resource_id
      "requester_group/#{name}"
    end

    def users_count
      users.kept.count
    end
  end
end
