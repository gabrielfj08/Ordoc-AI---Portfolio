class AddDepartmentReferenceToRoles < ActiveRecord::Migration[6.1]
  def change
    change_table :roles do |t|
      t.belongs_to :department, foreign_key: true
    end
  end
end
