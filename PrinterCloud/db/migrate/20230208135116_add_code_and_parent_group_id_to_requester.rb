class AddCodeAndParentGroupIdToRequester < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_flow.requesters', :code, :string
    add_column 'printer_flow.requesters', :parent_group_id, :integer
  end
end
