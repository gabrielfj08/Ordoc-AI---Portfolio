class CreatePrinterAirSharedObjects < ActiveRecord::Migration[6.1]
  def up
    create_table 'printer_air.shared_objects' do |t|
      t.string :record_type, null: false, index: true
      t.string :object_prn, null: false, index: true
      t.belongs_to :parent_shared
      t.string :prn, index: true, null: false
      t.belongs_to :organization
      t.belongs_to :created_by
      t.belongs_to :user

      t.timestamps
    end

    add_index 'printer_air.shared_objects', %i[user_id object_prn], unique: true
  end

  def down
    drop_table 'printer_air.shared_objects'
  end
end
