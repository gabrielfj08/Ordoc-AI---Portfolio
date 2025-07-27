module PrinterFlow
  class DocumentUploadWorker < S3Worker
    sidekiq_options queue: :medium

    def perform(params)
      @resource_class = params['class'].constantize
      @object = @resource_class.find(params['id'])
      @path = params['destination_directory_path']

      return if @object.finished?
      return if @object.document_id.present?

      create_target_path
      download_target
      create_document_and_attach_file
      delete_target
    rescue ActiveRecord::RecordInvalid => e
      retry
    rescue ActiveRecord::RecordNotUnique => e
      retry
    rescue StandardError => e
      raise
      @object.fail!
    end

    private

    def create_target_path
      FileUtils.mkdir_p(target_path)
    end

    def download_target
      s3_client.get_object(bucket: bucket, key: key, response_target: target_download)
    end

    def delete_target
      FileUtils.rm_rf(target)
      FileUtils.rm_rf(target_download)
    end

    def create_document_and_attach_file
      @document = PrinterAirServices::DocumentCreator.new({ description: 'Printer Flow',
                                                            original_filename: File.basename(target),
                                                            created_by_id: created_by_id,
                                                            path: target,
                                                            directory_id: directory.id,
                                                            ocr: true }).call
      @object.update!(document_id: @document.id)

      @object.finish!
    end

    def directory
      @directory ||= PrinterAir::Directory.find_or_create_by_prn(
        "prn:printer_air:#{organization.cnpj}:Meu Air/#{@path}", created_by_id
      )
    end

    def created_by_id
      @object.created_by_id
    end

    def bucket
      'printer-air-document-upload'
    end

    def organization
      @object.organization
    end

    def key
      @object.s3_key
    end

    def target_path
      File.dirname(target_download)
    end

    def target_download
      "#{Rails.root}/tmp/#{@path}/#{@object.name}"
    end

    def target
      if File.extname("#{Rails.root}/tmp/#{@path}/#{@object.name}").downcase == '.png' ||
         File.extname("#{Rails.root}/tmp/#{@path}/#{@object.name}").downcase == '.jpg' ||
         File.extname("#{Rails.root}/tmp/#{@path}/#{@object.name}").downcase == '.jpeg'
        transform_image_to_pdf
      else
        "#{Rails.root}/tmp/#{@path}/#{@object.name}"
      end
    end

    def transform_image_to_pdf
      image_properties = MiniMagick::Image.open("#{Rails.root}/tmp/#{@path}/#{@object.name}")
      document = "#{Rails.root}/tmp/#{@path}/#{@object.name}"

      Prawn::Document.generate("tmp/#{@path}/#{pdf_name}") do
        if image_properties[:height] >= 600 || image_properties[:width] >= 600
          if image_properties[:height] > image_properties[:width]
            image document, fit: [700, 700], position: :center
          else
            image document, fit: [550, 550], position: :center
          end
        else
          image document, position: :center
        end
      end

      "tmp/#{@path}/#{pdf_name}"
    end

    def pdf_name
      File.basename("#{Rails.root}/tmp/#{@path}/#{@object.name}", '.*') + '.pdf'
    end
  end
end
