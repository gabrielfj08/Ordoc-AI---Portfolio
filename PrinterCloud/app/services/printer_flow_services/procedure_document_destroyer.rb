module PrinterFlowServices
  class ProcedureDocumentDestroyer < ApplicationService
    def initialize(id)
      @procedure_document = ::PrinterFlow::ProcedureDocument.find(id)
      @procedure = @procedure_document.procedure
    end

    def call
      new_payload = @procedure.payload
      new_payload.map do |payload|
        if payload['field_type'] == 'attachment'
          payload['value'] = payload['value'].select { |item| item != @procedure_document.uuid }
        end
      end
      @procedure.payload = new_payload
      @procedure.save!(validate: false)
      @procedure_document.destroy!

      @procedure_document
    end
  end
end
