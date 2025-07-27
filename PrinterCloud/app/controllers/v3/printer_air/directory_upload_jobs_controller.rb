module V3
  module PrinterAir
    class DirectoryUploadJobsController < BaseController
      before_action :set_directory_upload_job, only: %i[show]

      def create
        directory_upload_job = ::PrinterAir::DirectoryUploadJob.new(create_params)
        authorize :create, directory_upload_job.directory_prn

        directory_upload_job.save!

        render json: directory_upload_job, serializer: ::V3::DirectoryUploadJobSerializer::Show, status: :ok
      end

      def show
        authorize :create, @directory_upload_job.directory_prn

        render json: @directory_upload_job, serializer: ::V3::DirectoryUploadJobSerializer::Show, status: :ok
      end

      private

      def create_params
        params.require(:directory_upload_job).permit(:description, :location, :ocr,
                                                     :s3_key).merge(created_by_id: current_user.id)
      end

      def set_directory_upload_job
        @directory_upload_job = ::PrinterAir::DirectoryUploadJob.find(params[:id])
      end
    end
  end
end
