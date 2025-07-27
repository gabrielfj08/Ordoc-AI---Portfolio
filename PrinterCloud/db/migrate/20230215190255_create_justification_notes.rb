class CreateJustificationNotes < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.justification_notes' do |t|
      t.belongs_to :created_by
      t.string :note
      t.string :action
      t.references :justifiable, polymorphic: true

      t.timestamps
    end
  end
end
