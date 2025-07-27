class AddDescriptionToTaskTemplate < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_flow.task_templates', :description, :string, index: true
  end
end
