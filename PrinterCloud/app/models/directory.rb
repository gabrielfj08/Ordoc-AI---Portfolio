class Directory < ApplicationRecord
  include ActionView::Helpers::NumberHelper
  include ActiveModel::Validations
  include Discard::Model
  include Prnable
  include Filterable
  include Searchable
  include Orderable
  include Trashable

  self.discard_column = :deleted_at
  self.searchable_fields = %i[name description]

  validates :name, :description, :department, presence: true
  validates :prn, presence: true, uniqueness: true
  validates :created_by_id, presence: true, on: :create
  validates_with DirectoryValidator

  before_validation :set_defaults
  before_validation :generate_prn
  after_commit :publish_directory_destroyed_event, on: :destroy
  after_commit :publish_directory_updated_event, on: :update

  has_many :directory_infos, dependent: :destroy
  has_many :documents, dependent: :destroy
  has_many :permissions, dependent: :destroy
  has_many :directory_uploads, dependent: :destroy
  has_many :children_directories, class_name: 'Directory', foreign_key: 'parent_directory_id',
                                  inverse_of: :parent_directory, dependent: :destroy

  has_many_attached :files

  belongs_to :department
  belongs_to :recycle_bin, optional: true
  belongs_to :parent_directory, class_name: 'Directory', foreign_key: 'parent_directory_id', optional: true
  belongs_to :created_by, class_name: 'User', foreign_key: 'created_by_id', optional: true
  belongs_to :updated_by, class_name: 'User', foreign_key: 'updated_by_id', optional: true
  belongs_to :deleted_by, class_name: 'User', foreign_key: 'deleted_by_id', optional: true

  has_one :organization, through: :department
  has_one :directory_upload_path, dependent: :destroy
  alias directories children_directories

  scope :search_by_name,        ->(query) { where(Directory.arel_table[:name].matches("%#{query}%")) }
  scope :search_by_description, ->(query) { where(Directory.arel_table[:description].matches("%#{query}%")) }

  scope :root, -> { where(parent_directory_id: nil) }
  scope :remove_tree, lambda { |directory|
                        where.not(id: directory.id).where.not(id: directory.sub_directories_tree.pluck(:id)).where.not(id: directory.parent_directory_id)
                      }

  scope :filter_by_organization_id, lambda { |organization_id|
                                      joins(department: :organization).where(department: { organization_id: organization_id })
                                    }
  scope :filter_by_organization_manager_id, lambda { |user_id|
                                              joins(department: [organization: :roles]).where(roles: { type: 'Roles::OrganizationManager', user_id: user_id })
                                            }
  scope :filter_by_department_member_id, lambda { |department_member_id|
                                           joins(department: :roles).where(roles: { user_id: department_member_id })
                                         }
  scope :filter_by_department_id, ->(department_id) { where(department_id: department_id, parent_directory_id: nil) }
  scope :filter_by_parent_directory_id, ->(parent_directory_id) { where(parent_directory_id: parent_directory_id) }
  scope :filter_by_name, ->(name) { where(Directory.kept.arel_table[:name].matches("%#{name}%")) }
  scope :filter_by_created_by_id, ->(created_by_id) { where(created_by_id: created_by_id) }
  scope :filter_by_updated_by_id, ->(updated_by_id) { where(updated_by_id: updated_by_id) }
  scope :filter_by_created_at, lambda { |created_at_range|
    filter_by_created_at_gte(created_at_range[:gte])
      .filter_by_created_at_lte(created_at_range[:lte])
  }
  scope :filter_by_created_at_gte, lambda { |created_at_gte|
                                     where('created_at >= ?', created_at_gte) if created_at_gte.present?
                                   }
  scope :filter_by_created_at_lte, lambda { |created_at_lte|
                                     where('created_at <= ?', created_at_lte) if created_at_lte.present?
                                   }

  scope :filter_by_updated_at, lambda { |updated_at_range|
    filter_by_updated_at_gte(updated_at_range[:gte])
      .filter_by_updated_at_lte(updated_at_range[:lte])
  }
  scope :filter_by_updated_at_gte, lambda { |updated_at_gte|
                                     where('updated_at >= ?', updated_at_gte) if updated_at_gte.present?
                                   }
  scope :filter_by_updated_at_lte, lambda { |updated_at_lte|
                                     where('updated_at <= ?', updated_at_lte) if updated_at_lte.present?
                                   }
  scope :filter_by_reader_id, lambda { |user_id|
                                joins(:permissions).where(permissions: { scope: :reader, user_id: user_id })
                              }
  scope :filter_by_writer_id, lambda { |user_id|
                                joins(:permissions).where(permissions: { scope: :writer, user_id: user_id })
                              }
  scope :filter_by_shared_directories, lambda { |user_id|
                                         joins(:permissions).where(permissions: { scope: 0..2, user_id: user_id }).distinct
                                       }

  after_discard do
    documents.discard_all
    permissions.discard_all
    children_directories.discard_all
  end

  after_undiscard do
    documents.undiscard_all
    permissions.undiscard_all
    children_directories.undiscard_all
  end

  @@sns_client = Aws::SNS::Client.new(credentials: PrinterCloud::Aws.credentials)

  def self.sns_client=(client)
    @@sns_client = client
  end

  def documents_count
    documents.not_trashed.kept.count
  end

  def total_directories_count
    children_directories.not_trashed.kept.reduce(children_directories.not_trashed.kept.count) do |total_directories_count, child_directory|
      total_directories_count += child_directory.total_directories_count
    end
  end

  def total_documents_count
    children_directories.not_trashed.kept.reduce(documents.not_trashed.kept.count) do |total_documents_count, child_directory|
      total_documents_count += child_directory.total_documents_count
    end
  end

  def recyclable_bin
    department.organization.recycle_bin
  end

  def total_size
    children_directories.not_trashed.kept.reduce(size) do |size, child_directory|
      size += child_directory.size
    end
  end

  def used_storage
    number_to_human_size(size.getvalue(0, 0))
  end

  def size
    query = <<-SQL
      SELECT SUM(byte_size)
      FROM active_storage_blobs
      JOIN active_storage_attachments
      ON active_storage_attachments.blob_id=active_storage_blobs.id
      JOIN documents
      ON documents.id=active_storage_attachments.record_id
      JOIN directories
      ON documents.directory_id=directories.id
      WHERE directories.id=#{id}
      AND active_storage_attachments.record_type='Document'
    SQL

    result = ActiveRecord::Base.connection.execute(query)
  end

  def path
    path = []
    dir = self

    loop do
      path << dir.name
      dir.parent_directory.nil? ? break : dir = dir.parent_directory
    end

    path << dir.department.name

    path.reverse.map { |word| "#{word}" }.join('/')
  end

  def documents_count_with_subdirectories
    # # TODO: REFACTOR TO USE BACKGROUND WORKER ON SHOW SERIALIZER ONLY
    # documents_count = 0
    # documents_count += self.documents.not_trashed.kept.count

    # self.children_directories.not_trashed.kept.each {|child_directory| documents_count += child_directory.documents_count_with_subdirectories }
    # return documents_count
    0
  end

  def is_sub_directory_of?(directory)
    directory.sub_directories_tree.pluck(:id).include?(id)
  end

  def sub_directories_tree
    children_directories.kept.not_trashed.reduce(children_directories.kept.not_trashed) do |sub_directories_tree, child_directory|
      sub_directories_tree += child_directory.sub_directories_tree
    end
  end

  def recycle_bin_sub_directories_tree
    children_directories.kept.reduce(children_directories.kept) do |recycle_bin_sub_directories_tree, child_directory|
      recycle_bin_sub_directories_tree += child_directory.recycle_bin_sub_directories_tree
    end
  end

  def ancestor_directory_tree
    iterable_directory = self

    return nil if iterable_directory.discarded? == true

    ancestor_directory_tree_array = []

    loop do
      return ancestor_directory_tree_array unless iterable_directory.parent_directory_id?

      ancestor_directory_tree_array << { id: iterable_directory.parent_directory.id,
                                         name: iterable_directory.parent_directory.name }

      iterable_directory = iterable_directory.parent_directory
    end
  end

  def documents_with_subdirectory_tree
    result = sub_directories_tree.map do |directory|
      directory.documents.kept.not_trashed
    end

    (documents.kept.not_trashed + result.flatten)
  end

  def move(path)
    update(path.to_attributes)
  end

  def child_directory?
    parent_directory_id.present?
  end

  def restore
    sanitize_name
    super

    children_directories.each(&:restore)
  end

  def self.find_or_create_by_path(path, created_by_id)
    organization_id, department, directories = path.split('/', 3)
    organization = Organization.find(organization_id)
    department =  organization.departments.kept.find_by_name(department)
    destination = department
    names = directories.split('/')

    names.each do |name|
      directory = destination.children_directories.not_trashed.find_by_name(name)

      unless directory.present?
        directory = destination.directories.create!(department_id: department.id,
                                                    name: name,
                                                    description: 'Carregado via Driver',
                                                    created_by_id: created_by_id)
      end

      destination = directory
    end

    destination
  end

  def publish_directory_created_event
    @@sns_client.publish({
                           topic_arn: "arn:aws:sns:sa-east-1:698497033648:directory-#{ENV['RAILS_ENV']}",
                           message: {
                             'Payload' => {
                               'Key' => "#{ENV['RAILS_ENV']}/#{department.organization_id}/#{path}/"
                             }
                           }.to_json,
                           message_attributes: {
                             'EventType' => {
                               data_type: 'String',
                               string_value: 'DirectoryCreated'
                             }
                           }
                         })
  end

  private

  def service_name
    'printer_air'
  end

  def prn_resource_id
    "#{path}/"
  end

  def set_defaults
    self.department_id = parent_directory.department_id if child_directory?
  end

  def sanitize_name
    repeated_directories = Directory.where(department_id: department_id, parent_directory_id: parent_directory_id)
                                    .where('name LIKE ?', "%#{name}%").not_trashed.kept
    return if repeated_directories.empty? || repeated_directories.include?(self)

    count = repeated_directories.count

    loop do
      break unless repeated_directories.pluck(:name).include? "#{name} (#{count})"

      count += 1
    end

    write_attribute(:name, "#{name} (#{count})")
  end

  def publish_directory_destroyed_event
    @@sns_client.publish({
                           topic_arn: "arn:aws:sns:sa-east-1:698497033648:directory-#{ENV['RAILS_ENV']}",
                           message: {
                             'Payload' => {
                               'Key' => "#{ENV['RAILS_ENV']}/#{department.organization_id}/#{path}/"
                             }
                           }.to_json,
                           message_attributes: {
                             'EventType' => {
                               data_type: 'String',
                               string_value: 'DirectoryDeleted'
                             }
                           }
                         })
  end

  def publish_directory_updated_event
    @@sns_client.publish({
                           topic_arn: "arn:aws:sns:sa-east-1:698497033648:directory-#{ENV['RAILS_ENV']}",
                           message: {
                             'Payload' => {
                               'Key' => "#{ENV['RAILS_ENV']}/#{department.organization_id}/#{path}/"
                             }
                           }.to_json,
                           message_attributes: {
                             'EventType' => {
                               data_type: 'String',
                               string_value: 'DirectoryUpdated'
                             }
                           }
                         })
  end
end
