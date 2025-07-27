class RenameVisibilityToPublicInProcedures < ActiveRecord::Migration[6.1]
  def change
    remove_column :procedures, :visibility
    add_column    :procedures, :public, :boolean, default: true
    add_index     :procedures, :public
  end
end
