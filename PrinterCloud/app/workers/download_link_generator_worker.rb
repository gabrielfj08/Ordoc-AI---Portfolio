class DownloadLinkGeneratorWorker
  include PrinterCloud::FileSystem::Utils
  include Sidekiq::Worker
  include Sidekiq::Status::Worker

  def proceed_to_upload_zip(_status, upload_parameters)
    ZipUploaderWorker.perform_async(upload_parameters)
  end

  def proceed_to_zip_folder(_status, jid)
    zip_name = DownloadLink.find_by_jid(jid).name
    path = "tmp/download/#{jid}/#{zip_name}.zip"

    batch = Sidekiq::Batch.new

    batch.on(:success,
             'DownloadLinkGeneratorWorker#proceed_to_upload_zip',
             { path: path, jid: jid, zip_name: zip_name })
    batch.jobs do
      ZipperWorker.perform_async({ jid: jid, name: DownloadLink.find_by_jid(jid).name })
    end
  end

  def perform(options)
    batch = Sidekiq::Batch.new

    batch.on(:success,
             'DownloadLinkGeneratorWorker#proceed_to_zip_folder',
             jid)

    batch.jobs do
      Directory.kept.where(id: options['directories_ids']).each do |download_directory|
        FileUtils.mkdir_p("tmp/download/#{options['jid']}/#{download_directory.name}")

        download_directory.documents_with_subdirectory_tree.each do |download_document|
          relative_path = [download_directory.name, Differ.diff_by_char(download_directory.path, download_document.path).as_json['raw'].last['delete'].to_s].join('').chomp('/').concat('/')
          DocumentDownloaderWorker.perform_async({
            path: relative_path,
            name: sanitize_name(download_document.original_filename),
            jid: jid,
            key: download_document.current_file.key
          })
        end
      end
      Document.kept.not_trashed.where(id: options['documents_ids']).each do |download_document|
        DocumentDownloaderWorker.perform_async({
          name: sanitize_name(download_document.original_filename),
          jid: jid,
          key: download_document.current_file.key
        })
      end
    end
  end
end
