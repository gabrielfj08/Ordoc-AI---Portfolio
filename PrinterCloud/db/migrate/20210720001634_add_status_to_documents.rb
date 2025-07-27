class AddStatusToDocuments < ActiveRecord::Migration[6.1]
  def change
    change_table :documents do |t|
      t.integer :status, null: false, default: 0
    end
  end
end
