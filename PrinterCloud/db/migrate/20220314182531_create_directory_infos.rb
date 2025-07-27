class CreateDirectoryInfos < ActiveRecord::Migration[6.1]
  def change
    create_table :directory_infos do |t|
      t.integer :status, null: false, default: 0
      t.string :total_size
      t.integer :total_directories_count
      t.integer :total_documents_count
      t.belongs_to :directory, foreign_key: true

      t.timestamps
    end
  end
end
