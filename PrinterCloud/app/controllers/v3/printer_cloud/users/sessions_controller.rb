# frozen_string_literal: true

module V3
  module PrinterCloud
    module Users
      class SessionsController < Devise::SessionsController
        before_action :set_organization
        before_action :set_user

        def create
          if @user.blocked?
            return render json: { message: I18n.t('printer_cloud.errors.messages.user_blocked') },
                          status: :forbidden
          end

          if @user.valid_password?(params[:session][:password])
            @user.update failed_attempts: 0
            @user.update_tracked_fields!(request)
            render json: { user: @user, token: @user.token }, status: :ok
          else
            @user.increment_failed_attempts_or_lock_account

            render json: { message: I18n.t('printer_cloud.errors.messages.invalid_password',
                                           attribute: "#{User::MAX_SIGNIN_FAILED_ATTEMPTS - @user.failed_attempts}") },
                   status: :unauthorized
          end
        end

        protected

        def set_user
          @user = @organization.printer_cloud_users.where(status: %i[blocked
                                                                     active]).kept.find_by!(username: params[:session][:username])
        end

        def set_organization
          @organization = Organization.kept.find_by!(subdomain: request.headers['X-Api-Subdomain'])
        end
      end
    end
  end
end
