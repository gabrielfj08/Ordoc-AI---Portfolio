class DirectoryInfoWorker < S3Worker
  def perform(id)
    @directory_info = DirectoryInfo.find(id)
    @directory = @directory_info.directory

    ActiveRecord::Base.transaction do
      @directory_info.update!(
        total_directories_count: @directory.total_directories_count,
        total_documents_count: @directory.total_documents_count,
        total_size: @directory.total_size
      )

      @directory_info.process!
    end
  rescue StandardError => e
    raise
    @directory_info.fail!
  end
end
