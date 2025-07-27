module ProcedureSerializer
  class Show < Base
    attribute(:department_name) { object.department.name }
  end 
end
