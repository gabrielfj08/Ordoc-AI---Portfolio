class CreatePrinterFlowRequesterAssingments < ActiveRecord::Migration[6.1]
  def up
    create_table 'printer_flow.requester_assingments' do |t|
      t.belongs_to :user
      t.belongs_to :requester

      t.timestamps
    end
  end

  def down
    drop_table 'printer_flow.requester_assingments'
  end
end
