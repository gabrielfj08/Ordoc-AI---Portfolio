class CreateRecentDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table :recent_documents do |t|
      t.references :document, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
