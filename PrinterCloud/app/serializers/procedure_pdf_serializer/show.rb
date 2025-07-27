module ProcedurePdfSerializer
  class Show < Base
    attribute(:url) { Rails.application.routes.url_helpers.rails_blob_path(object.file.attachment, only_path: true) if object.file.attached? }
  end
end
