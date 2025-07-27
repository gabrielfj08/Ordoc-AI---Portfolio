class CreatePrinterAirDocumentVersionUploadJobs < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_air.document_version_upload_jobs' do |t|
      t.string :s3_key, presence: true
      t.string :description
      t.string :location
      t.integer :status
      t.references :created_by, foreign_key: { to_table: :users }
      t.references :document

      t.timestamps
    end
  end
end
