class AlterIndexOnDirectories < ActiveRecord::Migration[6.1]
  def change
    remove_index :directories, name: :index_directories_on_name_and_department_id
    add_index :directories, [:name, :department_id, :parent_directory_id],name: :index_directories_on_name_and_department_id , unique: true
  end
end
