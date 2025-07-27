module AirServices
  class DocumentUpdator < ApplicationService
    def initialize(params)
      @i = 0
      @original_filename = params[:update_params][:original_filename]
      @update_params = params[:update_params]
      @document = Document.find(params[:id])
    end

    def call
      @document.update!(description: @update_params[:description], location: @update_params[:location], updated_by: @update_params[:updated_by],
                        original_filename: original_filename)

      @document
    rescue ActiveRecord::RecordInvalid => e
      @i += 1
      retry
    end

    private

    def original_filename
      original_filename = @original_filename
      if @i != 0
        base = ActiveStorage::Filename.new(File.basename(@update_params[:original_filename])).base
        extension = ActiveStorage::Filename.new(File.basename(@update_params[:original_filename])).extension_with_delimiter
        original_filename =
          "#{base}(#{@i})".gsub(/\(.*\d\)$/, "(#{@i})#{extension}")
      end
      original_filename
    end
  end
end
