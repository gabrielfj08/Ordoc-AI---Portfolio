class AddCreatedByToTaskAttachment < ActiveRecord::Migration[6.1]
  def change
    add_reference 'printer_flow.task_attachments', :created_by, foreign_key: { to_table: 'printer_flow.requesters' }
  end
end
