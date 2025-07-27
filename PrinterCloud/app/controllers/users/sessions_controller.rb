# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  before_action :set_user
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /users/sign_in
  def create
    if @user.pending?
      return render json: { message: 'Para fazer login, confirme sua conta acessando o e-mail cadastrado.' },
                    status: :forbidden
    elsif @user.blocked?
      return render json: { message: 'Account blocked.' },
                    status: :forbidden
    end

    if @user.valid_password?(params[:session][:password])
      @user.update failed_attempts: 0
      @user.update_tracked_fields!(request)
      render json: { user: @user, token: @user.token }, status: :ok
    else
      @user.increment_failed_attempts_or_lock_account
      render json: { remaining_attempts: User::MAX_SIGNIN_FAILED_ATTEMPTS - @user.failed_attempts },
             status: :unauthorized
    end
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  protected

  def set_user
    @user = User.find_by!(email: params[:session][:email])
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
