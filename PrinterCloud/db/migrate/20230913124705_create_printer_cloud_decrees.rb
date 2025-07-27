class CreatePrinterCloudDecrees < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_cloud.decrees' do |t|
      t.references :organization

      t.integer :decree_number, null: false
      t.date :decree_date, null: false
      t.text :decree_url, null: false
      t.integer :law_number
      t.date :law_date
      t.text :law_url
      t.text :body

      t.timestamps
    end
  end
end
