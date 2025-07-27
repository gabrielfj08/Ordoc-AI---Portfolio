class AddDefaultValueToProcedureColumns < ActiveRecord::Migration[6.1]
  def change
    change_column_default :procedures, :name,         from: nil, to: ""
    change_column_default :procedures, :description,  from: nil, to: ""
    change_column_default :procedures, :status,       from: nil, to: 0
  end
end
