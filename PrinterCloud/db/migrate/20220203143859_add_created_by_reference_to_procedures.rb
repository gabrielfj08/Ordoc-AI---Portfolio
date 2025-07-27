class AddCreatedByReferenceToProcedures < ActiveRecord::Migration[6.1]
  def change
    add_reference :procedures, :created_by, index: true, foreign_key: { to_table: :users }
  end
end
