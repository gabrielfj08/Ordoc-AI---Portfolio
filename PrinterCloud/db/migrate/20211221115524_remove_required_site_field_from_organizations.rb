class RemoveRequiredSiteFieldFromOrganizations < ActiveRecord::Migration[6.1]
  def change
    change_column_null :organizations, :site, true
  end
end
