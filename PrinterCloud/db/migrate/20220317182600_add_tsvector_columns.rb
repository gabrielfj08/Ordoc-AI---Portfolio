class AddTsvectorColumns < ActiveRecord::Migration[6.1]
  def up
    add_column :documents, :tsv, :tsvector
    add_index :documents, :tsv, using: "gin"

    execute <<-SQL
      CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
      ON documents FOR EACH ROW EXECUTE PROCEDURE
      tsvector_update_trigger(
        tsv, 'pg_catalog.portuguese', content
      );
    SQL

    now = Time.current.to_s(:db)
    update("UPDATE documents SET updated_at = '#{now}'")
  end

  def down
    execute <<-SQL
      DROP TRIGGER tsvectorupdate
      ON documents
    SQL

    remove_index :documents, :tsv
    remove_column :documents, :tsv
  end
end
