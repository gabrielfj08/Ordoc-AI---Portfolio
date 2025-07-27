module PrinterFlow
  module External
    class ReportWorker
      include Sidekiq::Worker
      sidekiq_options queue: :default

      def perform(id)
        @report = ::PrinterFlow::External::Report.find(id)
        @external_requester = @report.external_requester

        @report.run! unless @report.running?

        count_attributes
        @report.finish!
      rescue StandardError => e
        raise
        @report.fail!
      end

      private

      def count_attributes
        @report.update!(procedures_running_count: @external_requester.procedures.external.running.count)
        @report.update!(procedures_started_count: @external_requester.procedures.external.started.count)
        @report.update!(signatures_pending_count: @external_requester.signatures.created.count)
        @report.update!(tasks_running_count: @external_requester.tasks.running.count)
        @report.update!(shared_procedures_pending_count: @external_requester.shared_procedures.created.count)
      end
    end
  end
end
