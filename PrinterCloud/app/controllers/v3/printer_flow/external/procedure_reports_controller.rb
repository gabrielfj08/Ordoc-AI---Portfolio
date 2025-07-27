module V3
  module PrinterFlow
    module External
      class ProcedureReportsController < BaseController
        before_action :set_procedure, only: %i[create show]
        before_action :set_procedure_report, only: %i[show]
        load_ability :procedure_report

        def show
          authorize! :read, @procedure_report

          render json: @procedure_report, serializer: ::V3::External::ProcedureReportSerializer::Show,
                 status: :ok
        end

        def create
          @procedure_report = @procedure.external_procedure_reports.new
          authorize! :create, @procedure_report

          @procedure_report = @procedure.external_procedure_reports.find_or_create_by!(procedure_status: @procedure.status)

          render json: @procedure_report, serializer: ::V3::External::ProcedureReportSerializer::Show,
                 status: :created
        end

        private

        def set_procedure
          @procedure = @organization.printer_flow_procedures.find(params[:procedure_id])
        end

        def set_procedure_report
          @procedure_report = @procedure.external_procedure_reports.find(params[:id])
        end
      end
    end
  end
end
