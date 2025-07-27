# frozen_string_literal: true

module V3
  module PrinterCloud
    module Users
      class ConfirmationsController < Devise::ConfirmationsController
        before_action :set_organization
        # GET /resource/confirmation/new
        # def new
        #   super
        # end

        # POST /resource/confirmation
        def create
          user = @organization.printer_cloud_users
                              .kept
                              .not_confirmed.find_by(email: params[:user_email])

          user.resend_confirmation_instructions if user

          render json: { message: 'Verifique seu email.' }, status: :ok
        end

        # GET /resource/confirmation?confirmation_token=abcdef
        def show
          user = @organization.printer_cloud_users
                              .kept
                              .find_by_confirmation_token(params[:confirmation_token])

          if user
            user.confirm
            user.activate!
            raise Error::PrinterCloud::InvalidConfirmationTokenError if user.errors.present?
          else
            raise Error::PrinterCloud::InvalidConfirmationTokenError
          end

          render json: user, status: :ok
        end

        private

        def set_organization
          @organization = Organization.kept.find_by!(subdomain: request.headers['X-Api-Subdomain'])
        end

        # protected

        # The path used after resending confirmation instructions.
        # def after_resending_confirmation_instructions_path_for(resource_name)
        #   super(resource_name)
        # end

        # The path used after confirmation.
        # def after_confirmation_path_for(resource_name, resource)
        #   super(resource_name, resource)
        # end
      end
    end
  end
end
