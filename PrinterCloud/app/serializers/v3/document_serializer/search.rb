module V3
  module DocumentSerializer
    class Search < Base
      belongs_to :updated_by

      attributes :byte_size, :version_id

      attribute(:shared) { object.shared? }
      attribute(:shareable_link) { object.has_link? }
      attribute(:preview_content) do
        if @instance_options[:highlighting][object.id.to_s].present?
          @instance_options[:highlighting][object.id.to_s]['content'][0]
        end
      end

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
