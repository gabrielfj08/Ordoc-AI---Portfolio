class UpdateTsvectorTrigger < ActiveRecord::Migration[6.1]
  def up
    execute <<-SQL
      CREATE OR REPLACE FUNCTION content_trigger() RETURNS trigger AS $$
      begin
        new.tsv := to_tsvector(
          'pg_catalog.portuguese', left(new.content, 1024*1024)
        );
        return new;
      end
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS tsvectorupdate ON documents;

      CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
      ON documents FOR EACH ROW EXECUTE PROCEDURE content_trigger();
    SQL
  end

  def down
    execute <<-SQL
      DROP TRIGGER tsvectorupdate
      ON documents
    SQL
  end
end
