class AddDocumentsReferenceToInbox < ActiveRecord::Migration[6.1]
  def change
    add_reference :documents, :inbox, null: true, foreign_key: true
  end
end

