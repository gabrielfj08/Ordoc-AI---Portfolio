class AddPrnToPrinterCloudUserGroups < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_cloud.user_groups', :prn, :string, default: '', index: true, null: false

    change_column_default 'printer_cloud.user_groups', :prn, nil
  end
end
