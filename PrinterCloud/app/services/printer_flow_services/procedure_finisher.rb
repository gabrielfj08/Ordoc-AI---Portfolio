module PrinterFlowServices
  class ProcedureFinisher < ApplicationService
    def initialize(params)
      @procedure = params[:procedure]
      @created_by = params[:created_by]
    end

    def call
      @procedure.finish!
      create_procedure_report
      @procedure.notify('send_procedure_finished_notification') if @procedure.external?

      create_finish_note(@created_by)
      @procedure
    end

    private

    def create_procedure_report
      if @procedure.internal?
        @procedure.procedure_reports.create!(created_by_id: @created_by.id)
      else
        @procedure.external_procedure_reports.create!
      end
    end

    def create_finish_note(user)
      @procedure.justification_notes.create!(
        note: "Processo finalizado por #{user.internal_requester.name}, no dia #{Date.current.strftime('%d/%m/%Y')}, às #{Time.now.in_time_zone('America/Sao_Paulo').strftime('%Hh%M')}",
        action: 'finish',
        created_by_id: user.internal_requester.id
      )
    end
  end
end
