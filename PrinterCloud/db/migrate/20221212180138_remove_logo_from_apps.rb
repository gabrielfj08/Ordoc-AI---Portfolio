class RemoveLogoFromApps < ActiveRecord::Migration[6.1]
  def change
    remove_column :apps, :logo
  end
end
