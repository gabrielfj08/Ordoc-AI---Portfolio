class DocumentUploadWorker < S3Worker
  sidekiq_options queue: :low

  def perform(id)
    @document_upload_job = DocumentUploadJob.find(id)

    PathValidator.validate!(path)
    @original_filename = File.basename(key)
    @i = 0
    create_target_path
    download_target
    document = create_document_and_attach_file
    delete_target
    document.enqueue! migration: true if document.created?
    @document_upload_job.complete!
  rescue Errno::EISDIR => e
    @document_upload_job.invalidate!
  end

  private

  def create_target_path
    FileUtils.mkdir_p(target_path)
  end

  def download_target
    s3_client.get_object(bucket: bucket, key: key, response_target: target)
  end

  def delete_target
    FileUtils.rm(target)
  end

  def create_document_and_attach_file
    # TODO: ABSTRACT TRANSACTION TO SERVICE
    ActiveRecord::Base.transaction do
      document = directory.documents.create!(description: 'Carregado via Driver',
                                             location: 'Printer Cloud',
                                             original_filename: filename,
                                             created_by_id: created_by_id,
                                             department_id: directory.department_id)

      document.file.attach(io: File.open(target), filename: filename)

      document
    end
  rescue ActiveRecord::RecordInvalid => e
    @i += 1
    retry
  end

  def directory
    @directory ||= Directory.find_or_create_by_path(path, created_by_id)
  end

  def created_by_id
    ENV["#{@document_upload_job.service.upcase + '_ID'}"]
  end

  def department_id
    @document_upload_job.department_id
  end

  def bucket
    @document_upload_job.bucket
  end

  def filename
    if @i != 0
      base = ActiveStorage::Filename.new(File.basename(key)).base
      extension = ActiveStorage::Filename.new(File.basename(key)).extension_with_delimiter
      @original_filename =
        "#{base}(#{@i})".gsub(/\(.*\d\)$/, "(#{@i})#{extension}")
    end

    @original_filename
  end

  def key
    @document_upload_job.key
  end

  def path
    File.dirname(@document_upload_job.path)
  end

  def target_path
    File.dirname(target)
  end

  def target
    "/tmp/#{@document_upload_job.path}"
  end
end
