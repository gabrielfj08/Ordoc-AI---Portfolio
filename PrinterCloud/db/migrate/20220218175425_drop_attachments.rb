class DropAttachments < ActiveRecord::Migration[6.1]
  def change
    drop_table :attachments
  end
end
