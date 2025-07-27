class AddOrganizationReferenceToProcedureTemplates < ActiveRecord::Migration[6.1]
  def change
    remove_reference :procedure_templates, :department, foreign_key: true
    add_reference :procedure_templates, :organization, null: false, foreign_key: true, index: true
  end
end
