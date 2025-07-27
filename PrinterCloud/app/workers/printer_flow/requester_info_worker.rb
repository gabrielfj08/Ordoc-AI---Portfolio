module PrinterFlow
  class RequesterInfoWorker
    include Sidekiq::Worker
    sidekiq_options queue: :heavy

    def perform(id)
      @requester_info = ::PrinterFlow::RequesterInfo.find(id)
      @requester = @requester_info.requester

      ActiveRecord::Base.transaction do
        @requester_info.update!(
          procedures_count: @requester.procedures_count
        )

        @requester_info.finish!
      end
    rescue StandardError => e
      raise
      @requester_info.fail!
    end

    private

    def created_by
      @requester_info.created_by
    end
  end
end
