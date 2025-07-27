class CreatePrinterCloudThemes < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_cloud.themes' do |t|
      t.references :organization

      t.string :image_url
      t.string :color

      t.timestamps
    end
  end
end
