class CreateAddress < ActiveRecord::Migration[6.1]
  def change
    create_table :addresses do |t|
      t.integer :number, null: false
      t.string  :city, null: false
      t.string  :complement
      t.string  :neighborhood
      t.string  :postal_code, null: false
      t.string  :state, null: false
      t.string  :street, null: false
      t.references :addressable, polymorphic: true

      t.timestamps
    end

  end
end
