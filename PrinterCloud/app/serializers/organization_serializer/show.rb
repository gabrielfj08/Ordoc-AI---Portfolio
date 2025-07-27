module OrganizationSerializer
  class Show < Base
    attributes :used_storage, :users_count, :managers_count

    belongs_to :created_by
    has_one :address
    has_many :apps
    has_many :departments

    class UserSerializer < ActiveModel::Serializer
      attributes :id, :name
    end
  end
end
