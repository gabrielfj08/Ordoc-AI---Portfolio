module DocumentSerializer
  class Show < Base
    include Rails.application.routes.url_helpers
    include ActionView::Helpers::NumberHelper

    attributes :id, :original_filename, :status, :created_at, :updated_at, :description, :location, :directory_id, :path

    attribute(:permissions) { object.permissions.kept }
    attribute(:s3_key) { object.current_file.attachment.key if object.current_file.attached? }
  end
end
