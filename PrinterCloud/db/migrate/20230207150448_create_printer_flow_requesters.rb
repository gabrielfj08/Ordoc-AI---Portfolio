class CreatePrinterFlowRequesters < ActiveRecord::Migration[6.1]
  def up
    execute 'CREATE SCHEMA IF NOT EXISTS printer_flow'

    create_table 'printer_flow.requesters' do |t|
      t.belongs_to :organization
      t.string :name
      t.string :email
      t.string :cpf_cnpj
      t.string :type
      t.integer :status
      t.string :prn

      t.timestamps
    end
  end

  def down
    drop_table 'printer_flow.requesters'
    execute 'DROP SCHEMA printer_flow'
  end
end
