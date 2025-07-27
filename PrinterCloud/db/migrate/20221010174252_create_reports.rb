class CreateReports < ActiveRecord::Migration[6.1]
  def change
    create_table :reports do |t|
      t.decimal    :data, precision: 8, scale: 2
      t.string     :name
      t.string     :prn
      t.belongs_to :organization, foreign_key: true

      t.timestamps
    end

    add_index :reports, :prn, unique: true
    add_index :reports, :name
  end
end
