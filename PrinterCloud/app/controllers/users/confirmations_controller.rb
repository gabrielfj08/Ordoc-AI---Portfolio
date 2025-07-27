# frozen_string_literal: true

class Users::ConfirmationsController < Devise::ConfirmationsController
  # GET /resource/confirmation/new
  # def new
  #   super
  # end

  # POST /resource/confirmation
  def create
    user = User.not_confirmed.find_by(email: params[:user_email])

    user.resend_confirmation_instructions if user

    render json: { message: 'Verifique seu email.' }, status: :ok
  end

  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    user = User.find_by_confirmation_token(params[:confirmation_token])

    if user
      user.confirm
      user.activate!
      raise Error::PrinterCloud::InvalidConfirmationTokenError if user.errors.present?
    else
      raise Error::PrinterCloud::InvalidConfirmationTokenError
    end

    render json: user, status: :ok
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
