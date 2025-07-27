module PrinterFlowServices
  module External
    class ProcedureRunner < ApplicationService
      def initialize(params)
        @procedure = params[:procedure]
      end

      def call
        @procedure.run!
        create_task_for_procedure
        @procedure.notify('send_procedure_created_notification') if @procedure.external?

        @procedure
      end

      private

      def create_task_for_procedure
        task = @procedure.tasks.create!(name: 'Nova solicitação de usuário externo',
                                        description: 'Por favor, verifique o processo e dê o encaminhamento adequado.',
                                        group_assignee: @procedure.responsible_group, created_by_id: ENV['EXTERNAL_USER_ID'])
        task.run!
      end
    end
  end
end
