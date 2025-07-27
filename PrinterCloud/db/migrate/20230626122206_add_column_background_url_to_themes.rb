class AddColumnBackgroundUrlToThemes < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_cloud.themes', :background_url, :string
  end
end
