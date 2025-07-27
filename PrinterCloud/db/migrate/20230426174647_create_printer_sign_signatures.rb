class CreatePrinterSignSignatures < ActiveRecord::Migration[6.1]
  def change
    execute 'CREATE SCHEMA IF NOT EXISTS printer_sign'

    create_table 'printer_sign.signatures' do |t|
      t.references :signable, polymorphic: true
      t.references :requester, foreign_key: { to_table: 'printer_flow.requesters' }
      t.integer :status, index: true, null: false, default: 0
      t.integer :service, index: true
      t.string :token, index: true, null: false

      t.timestamps
    end
  end
end
