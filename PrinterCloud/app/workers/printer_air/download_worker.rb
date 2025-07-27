module PrinterAir
  class DownloadWorker < S3Worker
    sidekiq_options queue: :heavy

    def perform(id)
      @download_file_job = PrinterAir::DownloadJob.find(id)

      create_target_directories_download
      create_target_documents_download
      zip_files
      upload_zip

      @download_file_job.finish!

      delete_target
    rescue StandardError => e
      @download_file_job.fail!
    end

    private

    def create_target_directories_download
      directories.accessible_by_user(user, :read).each do |directory|
        create_targets(directory)
      end
    end

    def create_target_documents_download
      FileUtils.mkdir_p(target)

      documents.accessible_by_user(user, :read).each do |document|
        if document.current_file.attached?
          s3_client.get_object({ bucket: bucket, key: document.current_file.key },
                               target: "#{target}/#{document.original_filename}")
        end
      end
    end

    def create_targets(directory)
      PrinterAir::Directory.kept.accessible_by_user(user, :read).where('prn ilike ?',
                                                                       "#{directory.prn}%").each do |download_directory|
        download_directory_path = download_directory.prn.gsub(directory.prn, '')
        target_path = "#{target}/#{directory.name}/#{download_directory_path}"

        FileUtils.mkdir_p(target_path)

        download_directory.documents.current.kept.accessible_by_user(user, :read).each do |document|
          if document.current_file.attached?
            s3_client.get_object({ bucket: bucket, key: document.current_file.key },
                                 target: "#{target_path}/#{document.original_filename}")
          end
        end
      end
    end

    def zip_files
      target.sub!(%r{/$}, '')
      FileUtils.rm zip_file, force: true

      Zip::File.open(zip_file, 'w') do |zip|
        Dir["#{target}/**/**"].reject { |f| f == zip_file }.each do |file|
          zip.add(file.sub("#{target}/", ''), file)
        end
      end
    end

    def upload_zip
      s3_resource.bucket(download_bucket)
                 .object(s3_key)
                 .upload_file(zip_file)

      @download_file_job.update(s3_key: s3_key)
    end

    def documents
      PrinterAir::Document.current.kept.where(id: [@download_file_job.targets['document_ids']])
    end

    def directories
      PrinterAir::Directory.kept.where(id: [@download_file_job.targets['directory_ids']])
    end

    def env
      Rails.env
    end

    def user
      @download_file_job.created_by
    end

    def s3_key
      "#{env}/#{uuid}/#{zip_name}"
    end

    def target
      "tmp/#{env}/#{uuid}"
    end

    def zip_file
      "#{target}/#{zip_name}"
    end

    def zip_name
      "printer_air_download_#{download_timestamp}.zip"
    end

    def download_timestamp
      @download_file_job.created_at.strftime('%d%m%YT%H%M%S')
    end

    def uuid
      @download_file_job.uuid
    end

    def download_bucket
      'printer-air-download'
    end

    def delete_target
      FileUtils.rm_rf(target)
    end
  end
end
