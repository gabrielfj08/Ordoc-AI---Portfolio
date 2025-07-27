class AddSignedAtToTaskAttachmentSignatures < ActiveRecord::Migration[6.1]
  def change
    add_column :task_attachment_signatures, :signed_at, :datetime
  end
end
