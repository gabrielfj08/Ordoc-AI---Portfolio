module PrinterAirServices
  class DirectoryKeepMover < ApplicationService
    def initialize(params)
      @i = 0
      @directory = params[:record]
      @destination = params[:destination]
      @created_by_id = params[:created_by_id]
      @name = @directory.name
      @children_directories = find_children_directories
      @children_documents = find_children_documents
    end

    def call!
      ActiveRecord::Base.transaction do
        @directory.update!(name: sanitized_name,
                           parent_directory_id: @destination.id,
                           updated_by_id: @created_by_id)
        update_childrens
      end
    rescue ActiveRecord::RecordInvalid => e
      raise unless @directory.errors.include?(:prn)

      @i += 1
      retry
    end

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

    private

    def sanitized_name
      sanitized_name = @name

      if @i != 0
        sanitized_name =
          "#{@name}(#{@i})"
      end

      sanitized_name
    end
  end
end
