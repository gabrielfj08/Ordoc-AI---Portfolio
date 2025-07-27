class CreateFieldAttachment < ActiveRecord::Migration[6.1]
  def change
    create_table 'printer_flow.field_attachments' do |t|
      t.references :field_document_template, foreign_key: { to_table: 'printer_flow.field_document_templates' },
                                             index: { name: 'index_field_attachments_on_field_document_template_id' }
      t.references :field, foreign_key: { to_table: 'printer_flow.fields' }

      t.timestamps
    end
  end
end
