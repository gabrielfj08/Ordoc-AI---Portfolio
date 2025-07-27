class AddVersionAndWhatsAppToContactInformations < ActiveRecord::Migration[6.1]
  def change
    add_column :contact_informations, :whatsapp, :string, default: '', null: false
    add_column :contact_informations, :version, :string, default: '', null: false
    add_column :contact_informations, :system_name, :string, default: '', null: false

    change_column_default :contact_informations, :whatsapp, nil
    change_column_default :contact_informations, :version, nil
    change_column_default :contact_informations, :system_name, nil
  end
end
