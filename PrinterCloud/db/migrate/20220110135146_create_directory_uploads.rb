class CreateDirectoryUploads < ActiveRecord::Migration[6.1]
  def change
    create_table :directory_uploads do |t|
      t.boolean     :ocr
      t.string      :bid
      t.string      :s3_object_key
      t.belongs_to  :department,    foreign_key: true
      t.belongs_to  :directory,     foreign_key: true

      t.timestamps
    end
  end
end
