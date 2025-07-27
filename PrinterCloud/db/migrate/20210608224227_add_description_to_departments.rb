class AddDescriptionToDepartments < ActiveRecord::Migration[6.1]
  def change
    change_table :departments do |t|
      t.string :description, null: false, default: ""
    end
  end
end
