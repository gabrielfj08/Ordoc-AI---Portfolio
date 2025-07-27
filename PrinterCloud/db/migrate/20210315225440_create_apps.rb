class CreateApps < ActiveRecord::Migration[6.1]
  def change
    create_table :apps do |t|
      t.string :name

      t.timestamps
    end

    create_table :apps_organizations, id: false do |t|
      t.belongs_to :app
      t.belongs_to :organization
    end
  end
end
