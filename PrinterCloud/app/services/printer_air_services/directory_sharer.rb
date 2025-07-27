module PrinterAirServices
  class DirectorySharer < ApplicationService
    def initialize(directory, user_id, created_by)
      @directory = directory
      @path = @directory.name
      @created_by = created_by
      @user_id = user_id
    end

    def call
      ActiveRecord::Base.transaction do
        ::PrinterAir::SharedObject.create!(object_prn: @directory.prn,
                                           record_type: 'PrinterAir::Directory',
                                           parent_shared_id: nil,
                                           organization_id: @directory.organization_id,
                                           user_id: @user_id,
                                           created_by: @created_by)
        share_childrens
      end
    end

    private

    def share_childrens
      share_documents
      share_sub_directories
    end

    def share_documents
      @directory.documents.accessible_by_user(@created_by, :share).find_each do |document|
        ::PrinterAir::SharedObject.create!(object_prn: document.prn,
                                           record_type: 'PrinterAir::Document',
                                           parent_shared_id: get_parent_shared_document(document),
                                           organization_id: @directory.organization_id,
                                           user_id: @user_id,
                                           created_by: @created_by)
      end
    end

    def share_sub_directories
      @directory.sub_directories_tree.accessible_by_user(@created_by, :share).find_each do |child_directory|
        ::PrinterAir::SharedObject.create!(object_prn: child_directory.prn,
                                           record_type: 'PrinterAir::Directory',
                                           parent_shared_id: get_parent_shared(child_directory),
                                           organization_id: child_directory.organization_id,
                                           user_id: @user_id,
                                           created_by: @created_by)
        child_directory.documents.accessible_by_user(@created_by, :share).find_each do |document|
          ::PrinterAir::SharedObject.create!(object_prn: document.prn,
                                             record_type: 'PrinterAir::Document',
                                             parent_shared_id: get_parent_shared_document(document),
                                             organization_id: child_directory.organization_id,
                                             user_id: @user_id,
                                             created_by: @created_by)
        end
      end
    end

    def get_parent_shared(directory)
      ::PrinterAir::SharedObject.order(created_at: :asc).where(user_id: @user_id,
                                                               object_prn: directory.parent_directory.prn).last.id
    end

    def get_parent_shared_document(document)
      ::PrinterAir::SharedObject.order(created_at: :asc).where(user_id: @user_id,
                                                               object_prn: document.directory.prn).last.id
    end
  end
end
