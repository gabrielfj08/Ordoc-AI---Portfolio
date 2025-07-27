class AddServiceToPolicies < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_cloud.policies', :service, :integer
  end
end
