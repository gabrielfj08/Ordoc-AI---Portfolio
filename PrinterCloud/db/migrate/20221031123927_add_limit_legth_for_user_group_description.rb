class AddLimitLegthForUserGroupDescription < ActiveRecord::Migration[6.1]
  def change
    change_column 'printer_cloud.user_groups', :description, :string, limit: 255
  end
end
