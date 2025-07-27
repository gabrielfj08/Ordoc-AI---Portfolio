class AddNotesToProcedures < ActiveRecord::Migration[6.1]
  def change
    add_column  :procedures, :notes, :string

    add_index   :procedures, :deleted_at
  end
end
