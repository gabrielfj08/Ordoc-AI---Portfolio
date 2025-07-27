class RemoveDeletedAtFromPartakers < ActiveRecord::Migration[6.1]
  def change
    remove_column :partakers, :deleted_at, :datetime
  end
end
