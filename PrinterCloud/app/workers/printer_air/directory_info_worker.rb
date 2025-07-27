module PrinterAir
  class DirectoryInfoWorker < S3Worker
    sidekiq_options queue: :heavy

    def perform(id)
      @directory_info = PrinterAir::DirectoryInfo.find(id)
      @directory = @directory_info.directory

      ActiveRecord::Base.transaction do
        @directory_info.update!(
          total_directories_count: @directory.total_directories_count(created_by),
          total_documents_count: @directory.total_documents_count(created_by),
          total_size: @directory.total_size(created_by)
        )

        @directory_info.finish!
      end
    rescue StandardError => e
      raise
      @directory_info.fail!
    end

    private

    def created_by
      @directory_info.created_by
    end
  end
end
