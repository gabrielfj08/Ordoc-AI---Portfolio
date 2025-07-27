module PrinterFlowServices
  class ProcedureUnarchiver < ApplicationService
    def initialize(params)
      @procedure = params[:procedure]
      @created_by = params[:created_by]
      @action = params[:action]
      @note = params[:note]
    end

    def call
      ActiveRecord::Base.transaction do
        @procedure.unarchive!
        @procedure.justification_notes.create!(created_by_id: @created_by.id,
                                               note: @note,
                                               action: @action)
        @procedure.notify('send_procedure_unarchived_notification') if @procedure.external?

        @procedure
      end
    end
  end
end
