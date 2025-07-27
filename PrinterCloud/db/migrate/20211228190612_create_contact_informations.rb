class CreateContactInformations < ActiveRecord::Migration[6.1]
  def change
    create_table :contact_informations do |t|
      t.string :address, null: false
      t.string :contact_name, null: false
      t.string :name, null: false
      t.string :site
      t.string :phone, null: false
      t.string :email, null: false

      t.timestamps
    end
  end
end
