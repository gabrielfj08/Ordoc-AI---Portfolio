module PrinterFlow
  class GroupRequesterInfoWorker
    include Sidekiq::Worker
    sidekiq_options queue: :heavy

    def perform(id)
      @group_requester_info = ::PrinterFlow::GroupRequesterInfo.find(id)
      @group_requester = @group_requester_info.group_requester

      ActiveRecord::Base.transaction do
        @group_requester_info.update!(
          procedures_count: @group_requester.procedures_count
        )

        @group_requester_info.finish!
      end
    rescue StandardError => e
      raise
      @group_requester_info.fail!
    end

    private

    def created_by
      @group_requester_info.created_by
    end
  end
end
