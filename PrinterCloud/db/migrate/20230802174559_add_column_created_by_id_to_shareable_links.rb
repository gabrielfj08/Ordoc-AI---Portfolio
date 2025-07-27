class AddColumnCreatedByIdToShareableLinks < ActiveRecord::Migration[6.1]
  def change
    add_reference 'printer_air.shareable_links', :created_by, foreign_key: { to_table: :users }
  end
end
