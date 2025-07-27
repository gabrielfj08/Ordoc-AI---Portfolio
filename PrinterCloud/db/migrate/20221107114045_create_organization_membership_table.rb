class CreateOrganizationMembershipTable < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_cloud.organization_memberships' do |t|
      t.references :organization, presence: true, foreign_key: true
      t.references :user, presence: true, foreign_key: true

      t.timestamps
    end

    add_index 'printer_cloud.organization_memberships', %i[organization_id user_id], unique: true,
                                                                                     name: 'index_organization_memberships_on_organization_id_and_user_id'
  end
end
