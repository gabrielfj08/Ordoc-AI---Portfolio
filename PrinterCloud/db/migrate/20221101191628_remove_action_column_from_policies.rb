class RemoveActionColumnFromPolicies < ActiveRecord::Migration[6.1]
  def change
    remove_column 'printer_cloud.policies', :action, :string, array: true, default: []
  end
end
