class AddOrganizationIdToDocumentUploadJobs < ActiveRecord::Migration[6.1]
  def change
    add_reference :document_upload_jobs, :organization, foreign_key: true, index: true
    remove_reference :document_upload_jobs, :department
  end
end
