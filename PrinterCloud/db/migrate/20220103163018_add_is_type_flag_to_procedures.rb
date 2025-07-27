class AddIsTypeFlagToProcedures < ActiveRecord::Migration[6.1]
  def change
    add_column :procedures, :is_type, :boolean, null: false, default: false
  end
end
