class DropDocumentsContent < ActiveRecord::Migration[6.1]
  def up
    remove_column :documents, :content
  end

  def down
    add_column :documents, :content, :string
  end
end
