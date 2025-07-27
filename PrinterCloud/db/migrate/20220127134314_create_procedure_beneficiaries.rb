class CreateProcedureBeneficiaries < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_beneficiaries do |t|
      t.belongs_to :procedure
      t.belongs_to :beneficiary

      t.timestamps
    end
  end
end
