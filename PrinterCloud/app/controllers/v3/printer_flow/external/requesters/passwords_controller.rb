module V3
  module PrinterFlow
    module External
      module Requesters
        class PasswordsController < ApplicationController
          before_action :set_organization
          before_action :set_requester, only: %i[create]

          def create
            if params[:notification] == 'sms'
              ::PrinterFlow::ExternalRequesterNotifierSms.public_send('send_one_time_password_notification', @requester)
            else
              ::ExternalRequesterNotifierMailer.public_send('send_one_time_password_notification', @requester).deliver
            end

            render json: { message: I18n.t('printer_flow.success.external_requester.messages.one_time_password_sent',
                                           attribute: params[:notification], notification: masked_data) },
                   status: :ok
          end

          def update
            unless params[:password] == (params[:password_confirmation])
              raise ::Error::PrinterCloud::PasswordsDoNotMatchError
            end

            @requester = @organization.external_requesters.find_by(one_time_password: params[:one_time_password])

            if @requester && @requester.one_time_password_valid?

              @requester.update!(update_params)

              render json: @requester, serializer: ::V3::External::ExternalRequesterSerializer::Show, status: :ok
            else
              render json: { message: I18n.t('activerecord.errors.messages.invalid_one_time_password') },
                     status: :unprocessable_entity
            end
          end

          private

          def masked_data
            params[:notification] == 'sms' ? DataMask.mask_phone(@requester.phone) : DataMask.mask_email(@requester.email)
          end

          def update_params
            params.permit(:password, :password_confirmation).merge!(one_time_password: nil,
                                                                    failed_attempts: 0,
                                                                    changed_password: true,
                                                                    blocked: false)
          end

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
