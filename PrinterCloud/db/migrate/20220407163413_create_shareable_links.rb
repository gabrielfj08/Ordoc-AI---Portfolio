class CreateShareableLinks < ActiveRecord::Migration[6.1]
  def change
    create_table :shareable_links do |t|
      t.references :document, foreign_key: true
      t.integer    :status, null: false, default: 0
      t.integer    :expires_in
      t.string     :shareable_link

      t.timestamps
    end
  end
end
