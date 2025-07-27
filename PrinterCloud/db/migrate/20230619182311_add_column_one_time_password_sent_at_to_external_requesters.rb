class AddColumnOneTimePasswordSentAtToExternalRequesters < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_flow.requesters', :one_time_password_sent_at, :datetime
  end
end
