class RemoveVersionAndSystemNameFromContactInformations < ActiveRecord::Migration[6.1]
  def change
    remove_column :contact_informations, :system_name
    remove_column :contact_informations, :version
  end
end
