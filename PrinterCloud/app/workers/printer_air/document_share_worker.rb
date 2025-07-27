module PrinterAir
  class DocumentShareWorker < S3Worker
    sidekiq_options queue: :default

    def perform(id)
      @document = ::PrinterAir::Document.find(id)
      @prn = @document.prn

      @directory = ::PrinterAir::Directory.find_by!(prn: path)

      return unless @directory.shared?

      if @document.processed_file.attached?
        update_shared_objects
      else
        create_shared_objects
      end
    end

    private

    def update_shared_objects
      shared_objects = ::PrinterAir::SharedObject.where(object_prn: @prn)

      create_shared_objects if shared_objects.blank?

      shared_objects.each do |shared_object|
        shared_object.update!(object_prn: @prn)
      end
    end

    def create_shared_objects
      @directory.shared_objects.each do |shared_object|
        ::PrinterAir::SharedObject.find_or_create_by!(object_prn: @prn,
                                                      record_type: 'PrinterAir::Document',
                                                      parent_shared_id: shared_object.id,
                                                      organization_id: shared_object.organization_id,
                                                      user_id: shared_object.user_id,
                                                      created_by: shared_object.created_by)
      end
    end

    def path
      "#{File.dirname(@document.prn)}/"
    end
  end
end
