module V2
  module PrinterCloud
    class UsersController < ::BaseController
      def show
        render json: current_user, serializer: ::PrinterCloud::UserSerializer::Base, status: :ok
      end

      def update
        current_user.avatar.attach(params[:avatar]) unless params[:avatar].nil?
        current_user.update!(user_params)

        render json: current_user, serializer: ::PrinterCloud::UserSerializer::Base, status: :ok
      end

      def my_profiles
        profiles = current_user.profiles

        render json: { profiles: profiles }, status: :ok
      end

      private

      def user_params
        params.permit(:email, :name, :phone, :password, :password_confirmation, :cpf, :date_of_birth)
      end
    end
  end
end
