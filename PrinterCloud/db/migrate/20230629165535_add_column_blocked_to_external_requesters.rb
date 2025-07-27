class AddColumnBlockedToExternalRequesters < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_flow.requesters', :blocked, :boolean, default: false
  end
end
