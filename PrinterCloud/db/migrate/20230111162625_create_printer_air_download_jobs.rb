class CreatePrinterAirDownloadJobs < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_air.download_jobs' do |t|
      t.string :s3_key
      t.string :uuid, null: false
      t.jsonb :targets, null: false, default: '{}'
      t.references :created_by, foreign_key: { to_table: :users }
      t.integer :status, null: false

      t.timestamps
    end
  end
end
