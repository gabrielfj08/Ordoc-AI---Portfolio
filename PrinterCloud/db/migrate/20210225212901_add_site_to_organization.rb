class AddSiteToOrganization < ActiveRecord::Migration[6.1]
  def change
    change_table :organizations do |t|
      t.string :site, null: false
    end
  end
end
