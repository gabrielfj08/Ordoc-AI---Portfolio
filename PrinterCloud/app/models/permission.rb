class Permission < ApplicationRecord
  include Discard::Model

  self.discard_column = :deleted_at

  enum scope: %i[writer reader]

  validates :user, presence: true
  validates :user, uniqueness: { scope: %i[document directory] }
  validates :scope, presence: true
  validates :document, presence: true, unless: -> { directory.present? }
  validates :directory, presence: true, unless: -> { document.present? }
  validate :cannot_share_resource_with_themself
  validate :user_must_be_member_from_resource_organization

  belongs_to :directory, optional: true
  belongs_to :document, optional: true
  belongs_to :permission_granted_by, class_name: 'User', foreign_key: 'permission_granted_by_id'
  belongs_to :user, class_name: 'User', foreign_key: 'user_id'

  private

  def cannot_share_resource_with_themself
    errors.add :user, :invalid unless user != permission_granted_by
  end

  def user_must_be_member_from_resource_organization
    errors.add :user, :not_organization_member unless user.organizations.include? resource.organization
  end

  def resource
    resource = if document.present?
                 document
               else
                 directory
               end
  end
end
