class AddDescriptionToDirectories < ActiveRecord::Migration[6.1]
  def change
    change_table :directories do |t|
      t.string :description, null: false, default: ""
    end
  end
end
