class CreatePages < ActiveRecord::Migration[6.1]
  def change
    create_table :pages do |t|
      t.integer    :status, null: false
      t.string     :name, null: false
      t.belongs_to :document, foreign_key: true

      t.timestamps
    end
  end
end
