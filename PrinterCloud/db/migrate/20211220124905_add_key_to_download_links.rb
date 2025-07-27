class AddKeyToDownloadLinks < ActiveRecord::Migration[6.1]
  def change
    add_column :download_links, :key, :string
  end
end
