class AddLabelColumnToPolicyActions < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_cloud.policy_actions', :label, :string, index: true
  end
end
