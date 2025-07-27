module PrinterAir
  class UploadFileWorker < S3Worker
    def perform
      # override this method
    end

    private

    def create_target_path
      FileUtils.mkdir_p(target_path)
    end

    def download_target
      s3_client.get_object(bucket: bucket, key: s3_key, response_target: target)
    end

    def target
      "/tmp/#{s3_key}"
    end

    def target_path
      File.dirname(target)
    end

    def delete_target
      FileUtils.rm(target)
    end

    def delete_file_from_aws
      s3_client.delete_object({ bucket: bucket, key: s3_key })
    end
  end
end
