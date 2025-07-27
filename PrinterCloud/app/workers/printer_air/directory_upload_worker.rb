module PrinterAir
  class DirectoryUploadWorker < UploadFileWorker
    sidekiq_options queue: :heavy
    require 'zip'

    def perform(id)
      @directory_upload_job = PrinterAir::DirectoryUploadJob.find(id)

      return if @directory_upload_job.finished?

      create_target_path
      download_target
      extract_zip_and_create_files(target, target_path)
      delete_target
      delete_file_from_aws
    rescue StandardError => e
      raise
      @directory_upload_job.fail!
    end

    private

    def s3_key
      @directory_upload_job.s3_key
    end

    def bucket
      'printer-air-directory-upload'
    end

    def extract_zip_and_create_files(file, destination)
      Zip::File.open(file) do |zip_file|
        zip_file.each do |file|
          file_path = File.join(destination, file.name.force_encoding('UTF-8').encode('UTF-8', invalid: :replace))
          FileUtils.mkdir_p(File.dirname(file_path)) unless File.exist?(file_path)
          file.extract(file_path) unless File.exist?(file_path)

          create_file(file, file_path)
        end
      end

      @directory_upload_job.finish!
    end

    def create_file(file, path)
      if file.name_is_directory?
        return if s3_key == File.dirname(path)

        create_or_find_directory(path)
      else
        create_document(path)
      end
    end

    def create_or_find_directory(path)
      destination = PrinterAir::Directory.kept.find_by_prn("#{File.dirname(prnable(path))}/")

      existing_destination = destination.directories.kept.find_by(prn: prnable(path))

      destination = if !existing_destination
                      destination.directories.create!(name: File.basename(path),
                                                      description: description,
                                                      created_by_id: created_by_id,
                                                      updated_by_id: created_by_id,
                                                      organization: organization)
                    else
                      existing_destination
                    end
    end

    def create_document(path)
      directory = PrinterAir::Directory.kept.find_by_prn("#{File.dirname(prnable(path))}/")

      document = PrinterAirServices::DocumentCreator.new({ directory_id: directory.id,
                                                           original_filename: File.basename(path),
                                                           description: description,
                                                           location: location,
                                                           created_by_id: created_by_id,
                                                           path: path,
                                                           ocr: ocr }).call

      FileUtils.rm(path) if document.present?
    end

    def organization
      Organization.kept.find_by_cnpj(s3_key.split('/', 3).second)
    end

    def description
      @directory_upload_job.description
    end

    def location
      @directory_upload_job.location
    end

    def created_by_id
      @directory_upload_job.created_by_id
    end

    def ocr
      @directory_upload_job.ocr
    end

    def prnable(file_path)
      _bar, _tmp, _env, organization_cnpj, path = file_path.split('/', 5)

      "prn:printer_air:#{organization_cnpj}:#{path}"
    end
  end
end
