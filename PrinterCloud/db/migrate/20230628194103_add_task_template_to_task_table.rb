class AddTaskTemplateToTaskTable < ActiveRecord::Migration[6.1]
  def change
    add_reference 'printer_flow.tasks', :task_template, index: true
  end
end
