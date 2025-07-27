class CreateDocumentUploadJobs < ActiveRecord::Migration[6.1]
  def change
    create_table :document_upload_jobs do |t|
      t.belongs_to :department, foreign_key: true
      t.string     :bucket, null: false
      t.string     :key, null: false
      t.integer    :status, null: false, default: 0

      t.timestamps
    end

    add_index :document_upload_jobs, [:key, :department_id], unique: true
  end
end
