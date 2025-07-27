module PrinterFlowServices
  class ProcedureArchiver < ApplicationService
    def initialize(params)
      @procedure = params[:procedure]
      @created_by = params[:created_by]
      @action = params[:action]
      @note = params[:note]
    end

    def call
      ActiveRecord::Base.transaction do
        @procedure.archive!
        @procedure.justification_notes.create!(created_by_id: @created_by.id,
                                               note: @note,
                                               action: @action)
        @procedure.notify('send_procedure_archived_notification') if @procedure.external?

        @procedure
      end
    end
  end
end
