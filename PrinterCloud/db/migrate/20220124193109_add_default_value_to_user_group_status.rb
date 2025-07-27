class AddDefaultValueToUserGroupStatus < ActiveRecord::Migration[6.1]
  def change
    change_column_default :user_groups, :status, 0
  end
end
