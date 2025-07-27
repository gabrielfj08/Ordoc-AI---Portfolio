class CreateAirDocumentUploadJobs < ActiveRecord::Migration[6.1]
  def up
    execute 'CREATE SCHEMA IF NOT EXISTS printer_air'

    create_table 'printer_air.document_upload_jobs' do |t|
      t.integer :status, null: false
      t.string :s3_key, null: false
      t.string :description
      t.string :location
      t.integer :created_by_id, null: false

      t.timestamps
    end
  end

  def down
    drop_table 'printer_air.document_upload_jobs'
    execute 'DROP SCHEMA printer_air'
  end
end
