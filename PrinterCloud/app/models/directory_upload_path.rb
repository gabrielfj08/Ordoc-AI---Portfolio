class DirectoryUploadPath < ApplicationRecord
  after_create :create_directory

  belongs_to :department
  belongs_to :directory, optional: true

  validates :path, presence: true, uniqueness: { scope: :department_id }

  private

  def create_directory
    return if path == '.'

    destination = department

    path.split('/').each do |directory_name|
      break if directory_name == '.'

      destination = destination.directories.find_or_create_by!(name: directory_name,
                                                               department_id: department_id,
                                                               description: 'Carregado via Sender',
                                                               created_by_id: ENV['SENDER_ID'])
    end

    update!(directory: destination)
  end
end
