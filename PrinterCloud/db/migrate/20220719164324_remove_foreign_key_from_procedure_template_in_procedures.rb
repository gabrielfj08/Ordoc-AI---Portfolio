class RemoveForeignKeyFromProcedureTemplateInProcedures < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :procedures, column: :procedure_template_id
  end
end
