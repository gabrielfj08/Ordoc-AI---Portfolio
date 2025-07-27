class AddOrganizationToDirectories < ActiveRecord::Migration[6.1]
  def change
    add_reference :directories, :organization
  end
end
