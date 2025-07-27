class AddAddressAndPhoneToPartakers < ActiveRecord::Migration[6.1]
  def change
    add_column :partakers, :address, :string, null: false, default: ''
    add_column :partakers, :phone,   :string, null: false, default: ''

    change_column_default :partakers, :address, from: '', to: nil
    change_column_default :partakers, :phone,   from: '', to: nil
  end
end
