# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  before_action :validate_reset_password_token, only: :update

  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  def create
    user = User.find_by!(email: params[:email])
    if user.blocked?
      user.send_unlock_instructions
      return render json: { message: 'Email enviado' }, status: :ok
    end
    reset_password_token = user.send(:set_reset_password_token)
    user.update!(reset_password_token: reset_password_token)
    UserNotifierMailer.send_reset_password_email(user).deliver
    render json: { reset_password_token: reset_password_token }, status: :ok
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  # def edit
  #   super
  # end

  # PUT /resource/password
  def update
    @user.update!(password: params[:new_password])

    render json: { user: @user }, status: :ok
  end

  private

  def validate_reset_password_token
    @user = User.find_by!(reset_password_token: params[:reset_password_token])
    unless @user.reset_password_period_valid?
      render json: { message: 'Link de alteração de senha expirado.' },
             status: :unauthorized
    end
  end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
