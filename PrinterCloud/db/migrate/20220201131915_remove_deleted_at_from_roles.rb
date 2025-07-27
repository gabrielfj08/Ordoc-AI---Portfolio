class RemoveDeletedAtFromRoles < ActiveRecord::Migration[6.1]
  def change
    remove_column :roles, :deleted_at, :datetime
  end
end
