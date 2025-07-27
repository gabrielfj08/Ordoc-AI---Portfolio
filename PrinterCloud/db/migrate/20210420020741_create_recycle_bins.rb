class CreateRecycleBins < ActiveRecord::Migration[6.1]
  def change
    create_table :recycle_bins do |t|
      t.belongs_to :organization, foreign_key: true

      t.timestamps
    end
  end
end
