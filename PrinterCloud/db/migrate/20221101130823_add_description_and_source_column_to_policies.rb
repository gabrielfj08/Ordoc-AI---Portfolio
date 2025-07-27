class AddDescriptionAndSourceColumnToPolicies < ActiveRecord::Migration[6.1]
  def change
    add_column 'printer_cloud.policies', :description, :string, limit: 255
    add_column 'printer_cloud.policies', :source, :integer, null: false
  end
end
