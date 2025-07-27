class CreateProcedureViewers < ActiveRecord::Migration[6.1]
  def change
    create_table :procedure_viewers do |t|
      t.belongs_to :procedure
      t.belongs_to :viewer

      t.timestamps
    end
  end
end
