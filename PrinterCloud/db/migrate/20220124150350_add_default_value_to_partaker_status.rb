class AddDefaultValueToPartakerStatus < ActiveRecord::Migration[6.1]
  def change
    change_column_default :partakers, :status, 0
  end
end
