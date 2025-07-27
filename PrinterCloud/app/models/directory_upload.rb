class DirectoryUpload < ApplicationRecord
  def root
    Department.find_by(id: department_id) || Directory.find_by(id: directory_id)
  end
end
