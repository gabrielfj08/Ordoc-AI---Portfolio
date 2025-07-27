class CreateTaskAttachmentSignatures < ActiveRecord::Migration[6.1]
  def change
    create_table :task_attachment_signatures do |t|
      t.belongs_to :task_attachment,  foreign_key: true, index: { name: :idx_task_attachment_signatures_on_task_attachment_id }
      t.belongs_to :user,             foreign_key: true
      t.string     :signature

      t.timestamps
    end
  end
end
