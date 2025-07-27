module DocumentSerializer
  class Base < ActiveModel::Serializer
    include Rails.application.routes.url_helpers
    include ActionView::Helpers::NumberHelper

    attributes :id, :original_filename, :size, :status, :created_at, :updated_at, :deleted_at, :trashed_at,
               :description, :location, :directory_id, :path, :url
    belongs_to :created_by
    belongs_to :updated_by

    attribute(:s3_key) { object.current_file.attachment.key if object.current_file.attached? }
    attribute(:department_id) { object.directory&.department_id }
    attribute(:department_name) { object.directory&.department&.name }
    attribute(:directory_name) { object.directory&.name }
    attribute(:deleted_by_name) { object.deleted_by&.name }

    class UserSerializer < ActiveModel::Serializer
      attributes :id, :email, :name, :created_at, :updated_at, :phone, :cpf, :deleted_at, :date_of_birth,
                 :unlock_token_sent_at, :status, :prn
    end
  end
end
