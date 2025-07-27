class AddIndexToRequestersType < ActiveRecord::Migration[6.1]
  def change
    add_index 'printer_flow.requesters', :type
  end
end
