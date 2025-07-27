class CreateDownloadLinks < ActiveRecord::Migration[6.1]
  def change
    create_table :download_links do |t|
      t.string :jid
      t.integer :status
      t.references :user, null: false, foreign_key: true
      t.string :link
      t.string :name
      t.jsonb :targets, null: false, default: '{}'

      t.timestamps
    end

    add_index :download_links, :jid
  end
end
