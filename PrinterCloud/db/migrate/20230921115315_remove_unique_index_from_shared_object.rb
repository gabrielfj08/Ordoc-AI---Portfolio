class RemoveUniqueIndexFromSharedObject < ActiveRecord::Migration[6.1]
  def up
    execute <<-SQL
    DROP INDEX IF EXISTS printer_air."index_printer_air.shared_objects_on_user_id_and_object_prn"
    SQL

    add_index 'printer_air.shared_objects', %i[user_id parent_shared_id object_prn], unique: true,
                                                                                     name: 'index.shared_objects_user_and_parent_shared_and_object_prn'
  end

  def down
    execute <<-SQL
    DROP INDEX IF EXISTS printer_air."index.shared_objects_user_and_parent_shared_and_object_prn"
    SQL

    add_index 'printer_air.shared_objects', %i[user_id object_prn], unique: true
  end
end
