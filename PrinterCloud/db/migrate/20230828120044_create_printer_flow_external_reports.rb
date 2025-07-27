class CreatePrinterFlowExternalReports < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.external_reports' do |t|
      t.belongs_to 'external_requester', index: { unique: true }, foreign_key: { to_table: 'printer_flow.requesters' }
      t.integer 'status', index: true, null: false, default: 0
      t.integer 'procedures_running_count', null: false, default: 0
      t.integer 'procedures_started_count', null: false, default: 0
      t.integer 'tasks_running_count', null: false, default: 0
      t.integer 'signatures_pending_count', null: false, default: 0
      t.integer 'shared_procedures_pending_count', null: false, default: 0

      t.timestamps
    end
  end
end
