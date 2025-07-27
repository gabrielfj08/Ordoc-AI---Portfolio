module PrinterFlowServices
  module External
    class SharedProcedureRefuser < ApplicationService
      def initialize(params)
        @shared_procedure = params[:shared_procedure]
        @created_by = params[:created_by]
        @note = params[:note]
        @action = params[:action]
      end

      def call
        @shared_procedure.justification_notes.create!(created_by: @created_by,
                                                      note: @note,
                                                      action: @action)

        @shared_procedure.refuse!

        @shared_procedure
      end
    end
  end
end
