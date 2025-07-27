class IncreaseReportsDataPrecision < ActiveRecord::Migration[6.1]
  def change
    change_column :reports, :data, :decimal, precision: 16, scale: 2
  end
end
