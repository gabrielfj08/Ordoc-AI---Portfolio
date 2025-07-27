class AddDeletedAtToProcedureBeneficiaries < ActiveRecord::Migration[6.1]
  def change
    add_column :procedure_beneficiaries, :deleted_at, :datetime
    add_index  :procedure_beneficiaries, :deleted_at
  end
end
