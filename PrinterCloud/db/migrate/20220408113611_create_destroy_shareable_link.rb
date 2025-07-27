class CreateDestroyShareableLink < ActiveRecord::Migration[6.1]
  def change
    create_table :destroy_shareable_links do |t|
      t.references :document, foreign_key: true
      t.integer    :status, null: false, default: 0

      t.timestamps
    end
  end
end
