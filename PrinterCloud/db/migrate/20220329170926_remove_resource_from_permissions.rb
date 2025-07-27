class RemoveResourceFromPermissions < ActiveRecord::Migration[6.1]
  def change
    remove_reference :permissions, :resource, polymorphic: true, null: false
  end
end
