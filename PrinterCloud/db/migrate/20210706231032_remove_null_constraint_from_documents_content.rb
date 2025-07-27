class RemoveNullConstraintFromDocumentsContent < ActiveRecord::Migration[6.1]
  def up
    change_column_null :documents, :content, true
  end

  def down
    change_column_null :documents, :content, false
  end
end
