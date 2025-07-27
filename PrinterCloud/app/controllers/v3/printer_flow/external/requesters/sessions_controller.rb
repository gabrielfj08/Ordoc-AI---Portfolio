module V3
  module PrinterFlow
    module External
      module Requesters
        class SessionsController < Devise::SessionsController
          before_action :set_organization
          before_action :set_requester

          def create
            if @requester.blocked?
              return render json: { message: I18n.t('activerecord.errors.messages.external_requester_blocked') },
                            status: :forbidden
            end

            if @requester.valid_password?(params[:password])
              @requester.update failed_attempts: 0
              render json: { requester: @requester, token: @requester.token }, status: :ok
            else
              @requester.increment_failed_attempts_or_lock_account

              render json: { message: I18n.t('activerecord.errors.messages.invalid_password',
                                             attribute: "#{::PrinterFlow::ExternalRequester::MAX_SIGNIN_FAILED_ATTEMPTS - @requester.failed_attempts}") },
                     status: :unauthorized
            end
          end

          protected

          def set_requester
            @requester = @organization.external_requesters.find_by!(cpf_cnpj: params[:cpf_cnpj])
          end

          def set_organization
            @organization = Organization.kept.find_by!(subdomain: request.headers['X-Api-Subdomain'])
          end
        end
      end
    end
  end
end
