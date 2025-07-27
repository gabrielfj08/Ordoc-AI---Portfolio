module OrganizationSerializer
  class List < Base
    attributes :users_count, :managers_count, :deleted_at
    attribute(:departments_count) { object.departments.kept.count }

    has_one :address
    has_many :apps
  end
end
