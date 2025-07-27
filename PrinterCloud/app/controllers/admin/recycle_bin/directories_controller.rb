module Admin
  module RecycleBin
    class DirectoriesController < BaseController
      before_action :set_recycle_bin
      before_action :set_directory, only: [:restore]

      def restore
        authorize! :update, @directory
        @directory.undiscard
        render json: @directory, status: :ok, serializer: DirectorySerializer::RecycleBin
      end

      def restore_batch
        ActiveRecord::Base.transaction do 
          directories.each do |directory|
            authorize! :update, directory
            directory.undiscard
          end
        end
        render json: directories.reload, status: :ok, each_serializer: DirectorySerializer::RecycleBin
      end

      private

      def directories
        Directory.where(id: params[:directory_ids])
      end
      
      def current_ability
        @current_ability ||= ::AdminAbility.new(current_user)
      end

      def set_directory
        @directory = @recycle_bin.directories.find(params[:id] || params[:directory_id])
      end

      def set_recycle_bin
        @recycle_bin = ::RecycleBin.find(params[:recycle_bin_id])
      end
    end
  end
end
