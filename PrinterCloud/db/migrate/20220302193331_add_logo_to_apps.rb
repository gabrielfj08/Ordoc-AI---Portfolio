class AddLogoToApps < ActiveRecord::Migration[6.1]
  def change
    add_column :apps, :logo, :string, null: false, default: ''
  end
end
