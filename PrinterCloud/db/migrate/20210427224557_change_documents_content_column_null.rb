class ChangeDocumentsContentColumnNull < ActiveRecord::Migration[6.1]
  def up
    change_column_null :documents, :content, false
  end

  def down
    change_column_null :documents, :content, true
  end
end
