module PrinterAir
  class Directory < ApplicationRecord
    include ActionView::Helpers::NumberHelper
    include ActiveModel::Validations
    include Discard::Model
    include Filterable
    include Orderable
    include Prnable

    self.discard_column = :deleted_at
    self.per_page = 10

    before_validation :ensure_name_has_valid_characters, on: :create
    before_validation :generate_prn

    validates :name, :organization_id, :prn, presence: true
    validates :prn, uniqueness: true
    validates :created_by_id, :updated_by_id, presence: true, on: :create
    validates :updated_by_id, presence: true, on: :update
    validates :name, format: { with: Regex::DIRECTORY_FORMATTER, multiline: true }, on: %i[create update], unless: proc { |a|
                                                                                                                     a.parent_directory.blank?
                                                                                                                   }

    validate :parent_must_be_in_same_organization

    after_create :publish_directory_created_event

    after_commit :share_directory, if: lambda {
                                         parent_directory_id.present? && parent_directory.shared?
                                       }, on: %i[update create]

    after_commit :publish_directory_destroyed_event, on: :destroy

    has_many :shared_objects, class_name: 'PrinterAir::SharedObject', primary_key: 'prn', foreign_key: 'object_prn',
                              dependent: :destroy
    has_many :directory_infos, dependent: :destroy
    has_many :documents, class_name: 'PrinterAir::Document', dependent: :destroy
    has_many :children_directories, class_name: 'PrinterAir::Directory', foreign_key: 'parent_directory_id',
                                    inverse_of: :parent_directory, dependent: :destroy
    alias directories children_directories

    belongs_to :organization
    belongs_to :parent_directory, class_name: 'PrinterAir::Directory', foreign_key: 'parent_directory_id',
                                  optional: true
    validates :parent_directory, presence: { unless: :root? }
    belongs_to :created_by, class_name: 'PrinterCloud::User', foreign_key: 'created_by_id', optional: true
    belongs_to :updated_by, class_name: 'PrinterCloud::User', foreign_key: 'updated_by_id', optional: true

    scope :filter_by_directory_id, ->(directory_id) { where(parent_directory_id: directory_id) }
    scope :filter_by_prn, ->(prn) { where(prn: prn) }

    @@sns_client = Aws::SNS::Client.new(credentials: PrinterCloud::Aws.credentials)

    def self.sns_client=(client)
      @@sns_client = client
    end

    def shared?
      shared_objects.exists?
    end

    def path
      path = []
      dir = self

      loop do
        path << dir.name
        dir.parent_directory.nil? ? break : dir = dir.parent_directory
      end

      path = path.reverse.map { |word| "#{word}" }.join('/')
      "/#{path}"
    end

    def total_directories_count(user)
      accessible_directories(user).count - 1
    end

    def total_documents_count(user)
      accessible_documents(user).count
    end

    def total_size(user)
      size(accessible_documents(user).pluck(:id))
    end

    def size(document_ids)
      return '0 Bytes' if document_ids.empty?

      query = <<-SQL
        SELECT SUM(byte_size)
        FROM active_storage_blobs
        JOIN active_storage_attachments
        ON active_storage_attachments.blob_id=active_storage_blobs.id
        JOIN documents
        ON documents.id=active_storage_attachments.record_id
        WHERE documents.id IN (#{document_ids.join(',')})
        AND active_storage_attachments.record_type='PrinterAir::Document'
      SQL

      ActiveRecord::Base.connection.execute(query).getvalue(0, 0) || 0
    end

    def sub_directories_tree
      ::PrinterAir::Directory.where('prn ilike ?', "#{prn}%").where.not(id: id)
    end

    def self.find_or_create_by_prn(prn, created_by_id)
      root_directory_prn, directories = prn.split('/', 2)
      destination = PrinterAir::Directory.find_by!(prn: "#{root_directory_prn}/")
      names = directories.split('/')

      names.each do |name|
        directory = destination.directories.where(prn: "#{destination.prn}#{name}/")
                               .first_or_create!(name: name,
                                                 organization: destination.organization,
                                                 description: 'Carregado via Driver',
                                                 created_by_id: created_by_id,
                                                 updated_by_id: created_by_id)

        destination = directory
      end

      destination
    end

    private

    def share_directory
      return unless previous_changes.inspect.include?('prn')

      ActiveRecord::Base.transaction do
        parent_directory.shared_objects.each do |shared_object|
          ::PrinterAir::SharedObject.find_or_create_by!(object_prn: prn,
                                                        record_type: 'PrinterAir::Directory',
                                                        parent_shared_id: shared_object.id,
                                                        organization_id: organization.id,
                                                        user_id: shared_object.user_id,
                                                        created_by: shared_object.created_by)
          documents.each do |document|
            ::PrinterAir::DocumentShareWorker.perform_async(document.id)
          end
        end
      end
    end

    def ensure_name_has_valid_characters
      self.name = Formatters.remove_slash(name)
    end

    def accessible_documents(user)
      PrinterAir::Document.current.kept.accessible_by_user(user).where('prn ilike ?', "#{prn}%")
    end

    def accessible_directories(user)
      PrinterAir::Directory.kept.accessible_by_user(user).where('prn ilike ?', "#{prn}%")
    end

    def prn_resource_id
      "#{path.delete_prefix('/')}/"
    end

    def root?
      parent_directory.nil? &&
        name == 'Meu Air' || 'Lixeira'
    end

    def parent_must_be_in_same_organization
      return if parent_directory.nil? || organization == parent_directory.organization

      errors.add(:parent_directory,
                 I18n.t('activerecord.errors.messages.must_be_at_the_same_organization'))
    end

    def publish_directory_created_event
      @@sns_client.publish({
                             topic_arn: "arn:aws:sns:sa-east-1:698497033648:directory-#{ENV['RAILS_ENV']}",
                             message: {
                               'Payload' => {
                                 'Key' => "#{ENV['RAILS_ENV']}/#{organization.id}#{path}/"
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

    def publish_directory_destroyed_event
      @@sns_client.publish({
                             topic_arn: "arn:aws:sns:sa-east-1:698497033648:directory-#{ENV['RAILS_ENV']}",
                             message: {
                               'Payload' => {
                                 'Key' => "#{ENV['RAILS_ENV']}/#{organization.id}#{path}/"
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
  end
end
