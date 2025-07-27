class AlterColorInThemes < ActiveRecord::Migration[6.1]
  def up
    remove_column 'printer_cloud.themes', :color
    add_column 'printer_cloud.themes', :color, :integer, default: 0, null: false
  end

  def down
    remove_column 'printer_cloud.themes', :color
    add_column 'printer_cloud.themes', :color, :string, default: nil
  end
end
