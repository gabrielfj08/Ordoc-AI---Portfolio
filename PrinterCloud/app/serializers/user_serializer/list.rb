module UserSerializer
  class List < ActiveModel::Serializer
    attributes :id, :email, :name, :cpf, :phone, :date_of_birth, :created_at, :updated_at, :departments_count, :deleted_at

    def departments_count
      if @instance_options[:organization_id]
        Organization.find(@instance_options[:organization_id]).departments.accessible_by(DepartmentMemberAbility.new(object)).count
      else
        object.departments.count
      end
    end
  end
end
  