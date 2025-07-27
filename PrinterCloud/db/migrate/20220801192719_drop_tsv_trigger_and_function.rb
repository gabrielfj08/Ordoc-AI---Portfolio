class DropTsvTriggerAndFunction < ActiveRecord::Migration[6.1]
  def change
    execute <<-SQL
      DROP TRIGGER tsvectorupdate ON public.documents;
      DROP FUNCTION public.content_trigger();
    SQL
  end
end
