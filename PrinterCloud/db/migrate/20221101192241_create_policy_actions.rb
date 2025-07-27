class CreatePolicyActions < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_cloud.policy_actions' do |t|
      t.integer :service, index: true
      t.integer :access_level, index: true
      t.string :resource, index: true
      t.string :action, index: true

      t.timestamps
    end

    create_table 'printer_cloud.policy_action_assignments' do |t|
      t.references :policy, null: false, foreign_key: { to_table: 'printer_cloud.policies' }
      t.references :policy_action, null: false, foreign_key: { to_table: 'printer_cloud.policy_actions' },
                                   index: { name: 'index_policy_actions_assignment_on_policy_action_id' }

      t.timestamps
    end
  end
end
