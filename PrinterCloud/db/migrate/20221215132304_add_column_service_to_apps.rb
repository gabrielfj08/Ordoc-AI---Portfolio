class AddColumnServiceToApps < ActiveRecord::Migration[6.1]
  def change
    add_column :apps, :service, :integer,  default: 0, null: false

    change_column_default :apps, :service, nil
  end
end
