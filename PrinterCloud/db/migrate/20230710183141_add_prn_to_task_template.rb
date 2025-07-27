class AddPrnToTaskTemplate < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_flow.task_templates', :prn, :string, index: true
    remove_column 'printer_flow.task_fields', :task_template_id
  end
end
