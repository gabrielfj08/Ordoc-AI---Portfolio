class AddPayloadAndCreatedByToBatchOperations < ActiveRecord::Migration[6.1]
  def change
    add_column :batch_operations, :payload, :json
    add_reference :batch_operations, :created_by, foreign_key: { to_table: :users }, null: true
  end
end
