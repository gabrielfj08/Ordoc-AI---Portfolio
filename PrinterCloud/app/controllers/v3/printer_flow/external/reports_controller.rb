module V3
  module PrinterFlow
    module External
      class ReportsController < BaseController
        load_ability :reports

        def show
          report = ::PrinterFlow::External::Report.find(params[:id])
          authorize! :read, report

          render json: report, serializer: ::V3::External::ReportSerializer::Show, status: :ok
        end

        def create
          report = ::PrinterFlow::External::Report.find_or_create_by!(external_requester_id: current_user.id)
          report.run!

          render json: report, serializer: ::V3::External::ReportSerializer::Show, status: :created
        end
      end
    end
  end
end
