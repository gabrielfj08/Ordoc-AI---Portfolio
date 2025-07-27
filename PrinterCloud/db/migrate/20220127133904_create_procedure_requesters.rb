class CreateProcedureRequesters < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_requesters do |t|
      t.belongs_to :procedure
      t.belongs_to :requester

      t.timestamps
    end
  end
end
