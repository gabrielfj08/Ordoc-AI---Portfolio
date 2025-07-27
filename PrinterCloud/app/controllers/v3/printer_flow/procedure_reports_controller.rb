module V3
  module PrinterFlow
    class ProcedureReportsController < BaseController
      before_action :set_procedure, only: %i[index show create destroy]
      before_action :set_procedure_report, only: %i[show destroy]
      load_ability :procedure, :procedure_report

      attr_accessor :procedure

      def index
        authorize! :read, @procedure
        procedure_reports = @procedure.procedure_reports
                                      .filter_by(filter_params)
                                      .order_by(order_params)
                                      .paginate(per_page: params[:per_page],
                                                page: params[:page])

        render json: procedure_reports, meta: { total: procedure_reports.count },
               each_serializer: V3::ProcedureReportSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize! :create, @procedure_report

        render json: @procedure_report, serializer: V3::ProcedureReportSerializer::Show, status: :ok
      end

      def create
        procedure_report = @procedure.procedure_reports.new(created_by_id: current_user.id)
        authorize! :create, procedure_report

        procedure_report = @procedure.procedure_reports.where(procedure_status: 'finished').first_or_create!(
          created_by_id: current_user.id
        )

        render json: procedure_report, serializer: V3::ProcedureReportSerializer::Show, status: :created
      end

      def destroy
        authorize! :update, @procedure
        @procedure_report.destroy!

        render json: @procedure_report, serializer: V3::ProcedureReportSerializer::Show, status: :ok
      end

      def save
        authorize_create_procedure_report

        authorize :create, document_prn

        batch_operation = PrinterFlowServices::BatchOperationCreator.new(action: 'save_procedure_report_on_printer_air',
                                                                         record_type: 'PrinterFlow::Procedure',
                                                                         payload: { 'directory_id': params[:directory_id] },
                                                                         created_by: current_user,
                                                                         ids: params[:report_ids]).call

        render json: batch_operation, serializer: ::V3::BatchOperationSerializer::Show, status: :ok
      end

      private

      def filter_params
        params.permit(status: [])
      end

      def set_procedure_report
        @procedure_report = @procedure.procedure_reports.find(params[:id])
      end

      def set_procedure
        @procedure = @organization.printer_flow_procedures.find(params[:procedure_id])
      end

      def order_params
        params.permit(:order, :direction)
      end

      def authorize_create_procedure_report
        ::PrinterFlow::ProcedureReport.where(id: params[:report_ids]).each do |procedure_report|
          authorize! :create, procedure_report
        end
      end

      def document_prn
        "#{@organization.printer_air_directories.kept.find(params['directory_id']).prn}Relatório -"
      end
    end
  end
end
