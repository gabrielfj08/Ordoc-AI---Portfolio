class CreateGroupAssignment < ActiveRecord::Migration[6.1]
  def change
    create_table :group_assignments do |t|
      t.belongs_to :task
      t.belongs_to :user_group
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
