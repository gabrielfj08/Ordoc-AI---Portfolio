class CreatePrinterAirRecentDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_air.recent_documents' do |t|
      t.references :user, index: true
      t.references :document
      t.datetime :last_accessed_at, null: false, index: true

      t.timestamps
    end
  end
end
