class AddIndexToPartakersEmail < ActiveRecord::Migration[6.1]
  def change
    add_index :partakers, :email, unique: true
  end
end
