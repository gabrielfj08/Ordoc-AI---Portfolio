module PrinterAirServices
  class DirectoryCreator < ApplicationService
    def initialize(params)
      @directory_params = params[:create_params]
    end

    def call
      ActiveRecord::Base.transaction do
        @directory = PrinterAir::Directory.new(@directory_params)
        @directory.generate_prn
        @directory
      end
    end
  end
end
