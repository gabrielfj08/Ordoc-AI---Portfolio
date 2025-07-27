class AddCreatedByColumnDirectoryInfo < ActiveRecord::Migration[6.1]
  def change
    add_reference :directory_infos, :created_by, foreign_key: { to_table: :users }
  end
end
