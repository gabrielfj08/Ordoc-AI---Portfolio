module PrinterAirServices
  class DocumentUpdator < ApplicationService
    def initialize(params)
      @i = 0
      @original_filename = params[:update_params][:original_filename]
      @update_params = params[:update_params]
      @document = ::PrinterAir::Document.current.find(params[:id])
      @versions = @document.versions
    end

    def call
      ActiveRecord::Base.transaction do
        @document.update!(description: @update_params[:description], location: @update_params[:location], updated_by: @update_params[:updated_by],
                          original_filename: @update_params[:original_filename])

        @versions.each do |version|
          version.update!(original_filename: @update_params[:original_filename])
        end
      end

      @document
    end
  end
end
