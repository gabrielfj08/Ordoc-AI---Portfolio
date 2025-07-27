module Flow
  class UserGroupsUser < ApplicationRecord
    belongs_to :user_group, class_name: "Flow::UserGroup", foreign_key: "user_group_id"
    belongs_to :user, class_name: "User", foreign_key: "user_id"

    validates :user_group, uniqueness: { scope: :user }
  end
end
