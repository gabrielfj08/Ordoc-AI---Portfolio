module V3
  module PrinterAir
    class DocumentVersionUploadJobsController < BaseController
      before_action :set_document, only: %i[create]
      before_action :set_document_version_upload_job, only: %i[show]

      def create
        document_version_upload_job = ::PrinterAir::DocumentVersionUploadJob.new(create_params)
        authorize :create, document_version_upload_job.document_prn

        document_version_upload_job.save!

        render json: document_version_upload_job,
               serializer: ::V3::DocumentVersionUploadJobSerializer::Show, status: :ok
      end

      def show
        authorize :create, @document_version_upload_job.document_prn

        render json: @document_version_upload_job,
               serializer: V3::DocumentVersionUploadJobSerializer::Show, status: :ok
      end

      private

      def create_params
        params.require(:document_version_upload_job).permit(:description, :document_id, :location,
                                                            :s3_key).merge(document_id: @document.id, created_by_id: current_user.id)
      end

      def set_document
        @document = ::PrinterAir::Document.kept.current.find(params[:document_id])
      end

      def set_document_version_upload_job
        @document_version_upload_job = ::PrinterAir::DocumentVersionUploadJob.find(params[:id])
      end
    end
  end
end
