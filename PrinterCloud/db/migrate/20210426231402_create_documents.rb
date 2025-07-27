class CreateDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table :documents do |t|
      t.string      :original_filename, null: false
      t.string      :description
      t.string      :location
      t.text        :content
      t.belongs_to  :directory, foreign_key: true

      t.timestamps
    end
  end
end
