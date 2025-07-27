module V3
  module RequesterSerializer
    class Show < Base
      has_one :address
      has_one :user
      has_many :justification_notes

      class AddressSerializer < ActiveModel::Serializer
        attributes :id, :street, :number, :complement, :postal_code, :city, :state, :neighborhood, :created_at,
                   :updated_at, :deleted_at
      end

      class JustificationNoteSerializer < V3::JustificationNoteSerializer::Base
      end

      class UserSerializer < V3::UserSerializer::Base
      end
    end
  end
end
