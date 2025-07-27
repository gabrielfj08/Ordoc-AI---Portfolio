class AddProcedureTemplateReferenceToProcedures < ActiveRecord::Migration[6.1]
  def change
    add_reference :procedures, :procedure_template, foreign_key: true, index: true, null: false
  end
end
