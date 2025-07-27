module V3
  module DocumentSerializer
    class List < Base
      belongs_to :updated_by

      attribute(:shared) { object.shared? }
      attribute(:shareable_link) { object.has_link? }

      class UserSerializer < ActiveModel::Serializer
        attributes :id, :name
      end
    end
  end
end
