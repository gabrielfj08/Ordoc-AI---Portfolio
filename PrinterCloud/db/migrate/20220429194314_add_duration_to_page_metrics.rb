class AddDurationToPageMetrics < ActiveRecord::Migration[6.1]
  def change
    add_column :page_metrics, :duration, :float, default: 0, null: false

    change_column_default :page_metrics, :duration, from: 0, to: nil
  end
end
