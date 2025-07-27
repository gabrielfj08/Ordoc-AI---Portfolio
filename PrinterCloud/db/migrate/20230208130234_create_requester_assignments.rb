class CreateRequesterAssignments < ActiveRecord::Migration[6.1]
  def change
    drop_table 'printer_flow.requester_assingments'

    create_table 'printer_flow.requester_assignments' do |t|
      t.belongs_to :user
      t.belongs_to :requester

      t.timestamps
    end
  end
end
