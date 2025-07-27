module PrinterAirServices
  class DocumentTrasher < ApplicationService
    def initialize(params)
      @document = params[:record]
      @destination = params[:destination]
      @original_filename = @document.original_filename
      @previous_parent_prn = previous_parent_prn
      @updated_by_id = params[:created_by_id]
      @versions = PrinterAir::Document.where(prn: @document.prn).where.not(id: @document.id)
    end

    def call!
      ActiveRecord::Base.transaction do
        @document.update!(original_filename: filename,
                          previous_parent_prn: @previous_parent_prn,
                          updated_by_id: @updated_by_id,
                          directory_id: @destination.id)
        move_versions
      end
    end

    private

    def previous_parent_prn
      ::PrinterAir::Directory.kept.find_by(id: @document.directory_id).prn
    end

    def move_versions
      @versions.each do |version|
        version.update(directory_id: @destination.id,
                       previous_parent_prn: @previous_parent_prn,
                       original_filename: filename)
      end
    end

    def filename
      "#{@original_filename} #{trashed_at}"
    end

    def trashed_at
      time = DateTime.now
      time.strftime('%H:%M:%S')
    end
  end
end
