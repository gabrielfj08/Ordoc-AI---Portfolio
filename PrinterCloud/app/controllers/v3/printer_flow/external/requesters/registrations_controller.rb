module V3
  module PrinterFlow
    module External
      module Requesters
        class RegistrationsController < Devise::RegistrationsController
          before_action :set_organization

          def create
            ActiveRecord::Base.transaction do
              @requester = @organization.external_requesters.create!(sign_up_params)
              @requester.create_address!(address_params)
            end

            render json: @requester, serializer: ::V3::External::ExternalRequesterSerializer::Show, status: :created
          end

          private

          def address_params
            params.require(:address).permit(:city, :street, :number, :neighborhood, :complement, :postal_code, :state)
          end

          def sign_up_params
            params.require(:registration).permit(:email, :password, :name, :phone, :optional_phone, :optional_email,
                                                 :cpf_cnpj, :birth_date, :occupation, :notification)
          end

          def set_organization
            @organization = Organization.kept.find_by!(subdomain: request.headers['X-Api-Subdomain'])
          end
        end
      end
    end
  end
end
