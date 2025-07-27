class RecentDocument < ApplicationRecord
  include Discard::Model
  include Filterable
  include Orderable

  belongs_to :document
  belongs_to :user

  self.discard_column = :deleted_at

  scope :filter_by_department_member_id, -> (department_member_id) { where(user_id: department_member_id) }
  scope :filter_by_organization_id, -> (organization_id) { joins(document: { directory: :department }).where(department: { organization_id: organization_id }) }
end
