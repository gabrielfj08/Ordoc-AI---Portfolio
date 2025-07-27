# frozen_string_literal: true

module V3
  module PrinterCloud
    module Users
      class UnlocksController < Devise::UnlocksController
        # GET /resource/unlock/new
        # def new
        #   super
        # end

        # POST /resource/unlock
        def create
          Devise.token_generator.digest(resource_class,
                                        :unlock_token, params[:unlock_token])
          resource = resource_class.kept.find_or_initialize_with_error_by(:unlock_token,
                                                                          Devise.token_generator.digest(resource_class,
                                                                                                        :unlock_token, params[:unlock_token]))
          if resource.errors.empty? && resource.update!(reset_password_params)
            resource_class.kept.unlock_access_by_token(params[:unlock_token])
            resource.activate!
            resource.update failed_attempts: 0
            yield resource if block_given?
            resource.update!(unlock_token_sent_at: nil)

            render json: resource, status: :ok
          else
            render json: resource.errors, status: :unprocessable_entity
          end
        end

        # GET /resource/unlock?unlock_token=abcdef
        def show; end

        # protected

        # The path used after sending unlock password instructions
        # def after_sending_unlock_instructions_path_for(resource)
        #   super(resource)
        # end

        # The path used after unlocking the resource
        # def after_unlock_path_for(resource)
        #   super(resource)
        # end

        private

        def reset_password_params
          params.require(:registration).permit(:password, :password_confirmation)
        end
      end
    end
  end
end
