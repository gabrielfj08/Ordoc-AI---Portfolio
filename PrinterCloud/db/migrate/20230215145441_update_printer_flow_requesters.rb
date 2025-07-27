class UpdatePrinterFlowRequesters < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_flow.requesters', :phone, :string, index: true
    add_column 'printer_flow.requesters', :optional_phone, :string
    add_column 'printer_flow.requesters', :birth_date, :date
    add_column 'printer_flow.requesters', :optional_email, :string
    add_column 'printer_flow.requesters', :occupation, :string, index: true

    add_index 'printer_flow.requesters', :name
    add_index 'printer_flow.requesters', :email
    add_index 'printer_flow.requesters', :cpf_cnpj
    add_index 'printer_flow.requesters', :status
    add_index 'printer_flow.requesters', :prn
  end
end
