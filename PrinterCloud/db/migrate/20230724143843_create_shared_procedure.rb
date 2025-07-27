class CreateSharedProcedure < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.shared_procedures' do |t|
      t.references :external_requester, foreign_key: { to_table: 'printer_flow.requesters' }
      t.references :created_by, foreign_key: { to_table: 'printer_flow.requesters' }
      t.references :procedure, foreign_key: { to_table: 'printer_flow.procedures' }

      t.integer :status, index: true

      t.timestamps
    end
  end
end
