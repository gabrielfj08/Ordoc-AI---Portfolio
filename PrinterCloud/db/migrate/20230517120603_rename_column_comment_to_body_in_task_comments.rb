class RenameColumnCommentToBodyInTaskComments < ActiveRecord::Migration[6.1]
  def change
    rename_column 'printer_flow.task_comments', :comment, :body
  end
end
