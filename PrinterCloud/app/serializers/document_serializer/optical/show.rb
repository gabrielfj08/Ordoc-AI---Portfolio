module DocumentSerializer
  module Optical
    class Show < Base
      attribute(:url) { Rails.application.routes.url_helpers.rails_blob_path(object.current_file.attachment, only_path: true) if object.current_file.attached? }
    end
  end
end
