class AddDeletedAtToPartakers < ActiveRecord::Migration[6.1]
  def change
    add_column  :partakers, :deleted_at, :datetime
    add_index   :partakers, :deleted_at
  end
end
