class AddPathAndServiceToDocumentUploadJobs < ActiveRecord::Migration[6.1]
  def change
    add_column :document_upload_jobs, :path, :string, null: false, default: ""
    add_column :document_upload_jobs, :service, :integer, null: false, default: 0
    
    change_column_default :document_upload_jobs, :path, nil
    change_column_default :document_upload_jobs, :service, nil
  end
end
