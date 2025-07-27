module PrinterFlowServices
  module External
    class ProcedureFinishRequester < ApplicationService
      def initialize(params)
        @procedure = params[:procedure]
        @description = params[:description]
      end

      def call
        create_task_to_finish_procedure
        @task.run!

        @procedure
      end

      private

      def create_task_to_finish_procedure
        @task = @procedure.tasks.create!(name: 'Solicitação para finalizar o processo', description: @description,
                                         group_assignee: @procedure.responsible_group, created_by_id: ENV['EXTERNAL_USER_ID'], procedure_id: @procedure.id)
      end
    end
  end
end
