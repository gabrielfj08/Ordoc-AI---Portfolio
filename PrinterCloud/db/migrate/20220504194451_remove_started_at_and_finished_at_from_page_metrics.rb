class RemoveStartedAtAndFinishedAtFromPageMetrics < ActiveRecord::Migration[6.1]
  def change
    remove_column :page_metrics, :started_at
    remove_column :page_metrics, :finished_at
  end
end
