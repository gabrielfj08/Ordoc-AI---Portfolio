class CreatePrinterAirDirectoryUploadJobs < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_air.directory_upload_jobs' do |t|
      t.string :s3_key, null: false
      t.integer :status, null: false
      t.string :description
      t.string :location
      t.references :created_by, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
