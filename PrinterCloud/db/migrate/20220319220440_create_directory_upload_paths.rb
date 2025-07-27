class CreateDirectoryUploadPaths < ActiveRecord::Migration[6.1]
  def change
    create_table :directory_upload_paths do |t|
      t.belongs_to :department, foreign_key: true
      t.belongs_to :directory, foreign_key: true
      t.string     :path, null: false

      t.timestamps
    end

    add_index :directory_upload_paths, [:path, :department_id], unique: true
  end
end
