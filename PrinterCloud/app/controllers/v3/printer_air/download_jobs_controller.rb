module V3
  module PrinterAir
    class DownloadJobsController < BaseController
      before_action :set_download_job, only: %i[show]

      def create
        authorize_batch :read, documents, UnauthorizedMessages.download
        authorize_batch :read, directories, UnauthorizedMessages.download

        download_job = ::PrinterAir::DownloadJob.create!(create_params)

        render json: download_job, serializer: V3::DownloadJobSerializer::Show, status: :ok
      end

      def show
        render json: @download_job, serializer: V3::DownloadJobSerializer::Show, status: :ok
      end

      private

      def directories
        ::PrinterAir::Directory.kept.where(id: params[:download_job][:targets][:directory_ids])
      end

      def documents
        ::PrinterAir::Document.current.kept.where(id: params[:download_job][:targets][:document_ids])
      end

      def create_params
        params.require(:download_job)
              .permit(targets: [document_ids: [], directory_ids: []])
              .merge(created_by_id: current_user.id)
      end

      def set_download_job
        @download_job = ::PrinterAir::DownloadJob.find(params[:id])
      end
    end
  end
end
