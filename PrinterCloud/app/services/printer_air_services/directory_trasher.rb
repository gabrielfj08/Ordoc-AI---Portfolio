module PrinterAirServices
  class DirectoryTrasher < ApplicationService
    def initialize(params)
      @directory = params[:record]
      @destination = params[:destination]
      @created_by_id = params[:created_by_id]
      @previous_parent_prn = previous_parent_prn
      @name = @directory.name
      @children_directories = find_children_directories
      @children_documents = find_children_documents
    end

    def call!
      ActiveRecord::Base.transaction do
        @directory.update!(name: sanitized_name,
                           previous_parent_prn: @previous_parent_prn,
                           parent_directory_id: @destination.id,
                           updated_by_id: @created_by_id)
        update_childrens
      end
    end

    private

    def find_children_directories
      ::PrinterAir::Directory.kept.where('prn ilike ?', "#{@directory.prn}%").where.not(id: @directory.id)
    end

    def find_children_documents
      ::PrinterAir::Document.kept.where('prn ilike ?', "#{@directory.prn}%")
    end

    def update_childrens
      @children_directories.find_each(&:save!)
      @children_documents.find_each(&:save!)
    end

    def sanitized_name
      "#{@name} #{trashed_at}"
    end

    def previous_parent_prn
      ::PrinterAir::Directory.kept.find_by(id: @directory.parent_directory_id).prn
    end

    def trashed_at
      time = DateTime.now
      time.strftime('%H:%M:%S')
    end
  end
end
