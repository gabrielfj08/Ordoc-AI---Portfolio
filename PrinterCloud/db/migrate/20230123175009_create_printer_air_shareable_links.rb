class CreatePrinterAirShareableLinks < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_air.shareable_links' do |t|
      t.string :uuid, null: false, index: true
      t.string :document_prn, null: false, index: true
      t.integer :expires_in
      t.datetime :expires_at

      t.timestamps
    end
  end
end
