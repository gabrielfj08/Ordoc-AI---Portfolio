module DocumentSerializer
  module Optical
    class Base < ActiveModel::Serializer
      include ActionView::Helpers::NumberHelper

      attributes :id, :original_filename, :status, :created_at

      attribute(:size) { number_to_human_size(object.current_file.attachment.byte_size) if object.current_file.attached? }
    end
  end
end
