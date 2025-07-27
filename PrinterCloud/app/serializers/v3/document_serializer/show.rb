module V3
  module DocumentSerializer
    class Show < Base
      include ActionView::Helpers::NumberHelper

      attributes :id, :original_filename, :url, :status, :created_at, :updated_at, :description, :location,
                 :directory_id, :path, :download_url, :size, :byte_size

      belongs_to :created_by
      belongs_to :updated_by
      belongs_to :directory

      class DirectorySerializer < ActiveModel::Serializer
        attributes :name
      end

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :email, :name, :created_at, :updated_at, :phone, :cpf, :deleted_at, :date_of_birth,
                   :unlock_token_sent_at, :status, :prn
      end
    end
  end
end
