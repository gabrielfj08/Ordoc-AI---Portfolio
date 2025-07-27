class AddOcrColumnToDirectoryUploadJob < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_air.directory_upload_jobs', :ocr, :boolean, default: true
  end
end
