class AddDepartmentToUserGroups < ActiveRecord::Migration[6.1]
  def change
    add_reference :user_groups, :department, foreign_key: true
  end
end
