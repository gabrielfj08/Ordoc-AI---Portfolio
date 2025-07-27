class AddDefaultValueToDirectoryInfos < ActiveRecord::Migration[6.1]
  def up
    change_column :directory_infos, :total_size, :string, default: '0 Bytes', null: false
    change_column :directory_infos, :total_directories_count, :integer, default: 0, null: false
    change_column :directory_infos, :total_documents_count, :integer, default: 0, null: false
  end

  def down
    change_column :directory_infos, :total_size, :string
    change_column :directory_infos, :total_directories_count, :integer
    change_column :directory_infos, :total_documents_count, :integer
  end
end
