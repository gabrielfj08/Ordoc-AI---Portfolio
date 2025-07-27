module V3
  module PrinterAir
    class DocumentUploadJobsController < BaseController
      before_action :set_document_upload_job, only: %i[show]

      def create
        document_upload_job = ::PrinterAir::DocumentUploadJob.new(create_params)

        authorize :create, document_upload_job.document_prn

        document_upload_job.save!

        render json: document_upload_job, serializer: ::V3::DocumentUploadJobSerializer::Show, status: :ok
      end

      def show
        authorize :create, @document_upload_job.document_prn

        render json: @document_upload_job, serializer: ::V3::DocumentUploadJobSerializer::Show, status: :ok
      end

      private

      def create_params
        params.require(:document_upload_job).permit(:description, :location, :ocr,
                                                    :s3_key).merge(created_by_id: current_user.id)
      end

      def set_document_upload_job
        @document_upload_job = ::PrinterAir::DocumentUploadJob.find(params[:id])
      end
    end
  end
end
