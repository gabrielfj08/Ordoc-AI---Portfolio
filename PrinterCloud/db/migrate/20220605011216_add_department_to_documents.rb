class AddDepartmentToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_reference :documents, :department, foreign_key: true, index: true
  end
end
