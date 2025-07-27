class DirectoryUploadWorker < S3Worker
  def perform(id, options)
    @directory_upload = DirectoryUpload.find(id)
    @s3_object_key = options['s3_object_key']
    @description = options['description'] || 'Carregado via Air'
    @location = options['location'] || 'Printer Cloud'

    @root = @directory_upload.root
    @created_by_id = options['created_by_id']
    @documents = options['documents']
    @ocr = options['ocr']
    @i = 0

    is_directory = !@documents

    @batch = Sidekiq::Batch.new
    @directory_upload.update(bid: @batch.bid)

    download_file_to_disk(file_paths)

    if is_directory
      unzip_file
    else
      iterate_over_documents
    end

    # rescue StandardError => e
    #   Rails.logger.error e.message
    # ensure
    #   delete_tmp_path
  end

  private

  def s3_client
    Aws::S3::Client.new(credentials: PrinterCloud::Aws.credentials)
  end

  def unzip_file
    ZipExtractor.new(file_paths.first, tmp_path).extract do |file, _path|
      next if file.name_is_directory?

      build_document file.name
    end
  end

  def iterate_over_documents
    @documents.each do |file|
      raise StandardError unless File.exist? tmp_path.join(file['name'])

      build_document file['name']
    end
  end

  def build_document(filename)
    directory = create_destination_directory(sanitize_filename(filename))
    document = create_document_and_attach_file(filename, directory)

    @batch.jobs do
      document.enqueue! if ActiveModel::Type::Boolean.new.cast(@ocr)
    end
  end

  def download_file_to_disk(file_paths)
    create_tmp_path
    file_paths.each_with_index do |file_path, index|
      s3_client.get_object(bucket: bucket, key: @s3_object_key || @documents[index]['s3_key'],
                           response_target: file_path)
    end
  end

  def create_tmp_path
    FileUtils.mkdir_p(tmp_path)
  end

  def create_destination_directory(filename)
    destination = @root

    directory_names = File.dirname(filename).split('/')
    directory_names.each do |directory_name|
      break if directory_name == '.'

      existing_destination = destination.directories.not_trashed.kept.find_by(name: directory_name,
                                                                              department_id: department_id)

      if !existing_destination
        destination = destination.directories.create!(name: directory_name, description: 'Carregado via Air',
                                                      department_id: department_id, created_by_id: @created_by_id)
        destination.publish_directory_created_event if destination.is_a?(Directory)
      else
        destination = existing_destination
      end
    end

    destination
  end

  def create_document_and_attach_file(filename, directory)
    @original_filename = File.basename(filename)

    if @i != 0
      base = ActiveStorage::Filename.new(File.basename(filename)).base
      extension = ActiveStorage::Filename.new(File.basename(filename)).extension_with_delimiter
      @original_filename =
        "#{base}(#{@i})".gsub(/\(.*\d\)$/, "(#{@i})#{extension}")
    end

    document = directory.documents.create!(
      description: @description,
      location: @location,
      original_filename: @original_filename,
      created_by_id: @created_by_id,
      department_id: Directory.find(directory.id).department_id
    )

    unless document.file.attached?
      document.file.attach(io: File.open(tmp_path.join(filename)),
                           filename: @original_filename,
                           content_type: 'application/pdf')
    end

    document
  rescue ActiveRecord::RecordInvalid => e
    @i += 1
    retry
  end

  def sanitize_filename(filename)
    filename.force_encoding('UTF-8').encode('UTF-8', invalid: :replace)
  end

  def delete_tmp_path
    FileUtils.rm_rf(tmp_path)
  end

  def file_paths
    [@s3_object_key || @documents.map { |doc| doc['name'] }].flatten.map { |obj_key| tmp_path.join(obj_key) }
  end

  def tmp_path
    Pathname.new('/tmp').join(jid)
  end

  def department_id
    @department_id ||= @root[:department_id] || @root[:id]
  end

  def bucket
    'printer-cloud-upload-directories'
  end
end
