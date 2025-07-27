class CreatePageMetrics < ActiveRecord::Migration[6.1]
  def change
    create_table :page_metrics do |t|
      t.references :page
      t.string     :byte_size
      t.datetime   :started_at
      t.datetime   :finished_at

      t.timestamps
    end
  end
end
