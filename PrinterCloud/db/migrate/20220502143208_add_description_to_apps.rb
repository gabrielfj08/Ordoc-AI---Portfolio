class AddDescriptionToApps < ActiveRecord::Migration[6.1]
  def change
    add_column :apps, :description, :string, null: false, default: ''

    change_column_default :apps, :description, nil
  end
end
