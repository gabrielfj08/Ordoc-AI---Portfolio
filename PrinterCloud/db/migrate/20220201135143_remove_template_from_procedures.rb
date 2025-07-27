class RemoveTemplateFromProcedures < ActiveRecord::Migration[6.1]
  def change
    remove_column :procedures, :template
  end
end
