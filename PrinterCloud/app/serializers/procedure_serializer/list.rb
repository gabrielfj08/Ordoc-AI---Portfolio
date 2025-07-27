module ProcedureSerializer
  class List < Base
    belongs_to :procedure_template

    class ProcedureTemplateSerializer < ActiveModel::Serializer
      attributes :name
    end

    attribute(:department_name) { object.department.name }
  end 

end
