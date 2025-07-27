class CreatePolicies < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_cloud.policies' do |t|
      t.string :name, null: false, index: true
      t.string :prn, null: false, index: true
      t.integer :effect, null: false
      t.string :resource, array: true, default: []
      t.string :action, array: true, default: []
      t.belongs_to :organization

      t.timestamps
    end

    create_table 'printer_cloud.policy_attachments' do |t|
      t.references :policy_attachable, polymorphic: true
      t.references :policy, null: false, foreign_key: { to_table: 'printer_cloud.policies' },
                            index: { name: 'index_printer_cloud_policy_attachments.policy_id' }

      t.timestamps
    end
  end
end
