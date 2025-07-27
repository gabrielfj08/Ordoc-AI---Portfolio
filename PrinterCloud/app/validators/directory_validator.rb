class DirectoryValidator < ActiveModel::Validator
  def validate(record)
    parent_must_be_in_the_same_department_as_child(record)
  end

  private

  def parent_must_be_in_the_same_department_as_child(record)
    return unless record.parent_directory.present?

    unless record.parent_directory.department_id == record.department_id
      record.errors.add(:parent_directory_id, :parent_must_be_in_the_same_department_as_child)
    end
  end

  def must_not_have_same_name_of_non_deleted_document(record)
    if record.class.where(name: record.name, parent_directory_id: record.parent_directory_id, department_id: department_id, deleted_at: nil).any?
      record.errors.add(:name, :uniqueness)
    end
  end
end
