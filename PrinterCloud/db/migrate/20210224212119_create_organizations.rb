class CreateOrganizations < ActiveRecord::Migration[6.1]
  def change
    create_table :organizations do |t|
      t.string :corporate_name, null: false
      t.string :email,          null: false
      t.string :phone,          null: false

      t.timestamps
    end
  end
end
