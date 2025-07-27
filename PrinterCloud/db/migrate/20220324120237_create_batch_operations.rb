class CreateBatchOperations < ActiveRecord::Migration[6.1]
  def change
    create_table :batch_operations do |t|
      t.string  :record_type, null: false
      t.string  :action, null: false
      t.integer :ids, array: true
      t.integer :status, null: false, default: 0

      t.timestamps
    end
  end
end
