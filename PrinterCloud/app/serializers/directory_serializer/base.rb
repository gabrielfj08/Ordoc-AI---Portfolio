module DirectorySerializer
  class Base < ActiveModel::Serializer
    attributes :id, :name, :description, :department_id, :parent_directory_id, :created_at, :updated_at, :trashed_at

    belongs_to :created_by
    belongs_to :updated_by

    class UserSerializer < ActiveModel::Serializer
      attributes :id, :email, :name, :created_at, :updated_at, :phone, :cpf, :deleted_at, :date_of_birth,
                 :unlock_token_sent_at, :status, :prn
    end
  end
end
