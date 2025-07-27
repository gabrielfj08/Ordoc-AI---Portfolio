module PrinterFlowServices
  class ProcedureTemplateDeactivator < ApplicationService
    def initialize(params)
      @procedure_template = params[:procedure_template]
      @created_by = params[:created_by]
      @note = params[:note]
      @action = params[:action]
    end

    def call
      ActiveRecord::Base.transaction do
        PrinterFlow::JustificationNote.create!(note: @note,
                                               created_by: @created_by,
                                               justifiable_id: @procedure_template.id,
                                               justifiable_type: 'PrinterFlow::ProcedureTemplate',
                                               action: @action)

        @procedure_template.deactivate!
      end

      @procedure_template
    end
  end
end
