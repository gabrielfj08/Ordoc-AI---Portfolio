class RemoveDeletedAtFromProcedureBeneficiaries < ActiveRecord::Migration[6.1]
  def change
    remove_column :procedure_beneficiaries, :deleted_at, :datetime
  end
end
