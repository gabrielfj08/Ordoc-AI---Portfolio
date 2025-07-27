class AddPasswordToExternalRequester < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_flow.requesters', :encrypted_password, :string
    add_column 'printer_flow.requesters', :changed_password, :boolean, default: false
    add_column 'printer_flow.requesters', :one_time_password, :string
    add_column 'printer_flow.requesters', :notification, :integer
    add_column 'printer_flow.requesters', :failed_attempts, :integer, default: 0, null: false
  end
end
