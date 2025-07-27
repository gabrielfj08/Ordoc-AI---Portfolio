class RemoveDirectoriesNameIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :directories, name: :index_directories_on_name_and_department_id
  end
end
