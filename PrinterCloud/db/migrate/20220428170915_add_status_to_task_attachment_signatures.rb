class AddStatusToTaskAttachmentSignatures < ActiveRecord::Migration[6.1]
  def change
    add_column :task_attachment_signatures, :status, :integer, null: false,  default: 0
  end
end
