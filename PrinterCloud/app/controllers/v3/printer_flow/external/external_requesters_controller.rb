module V3
  module PrinterFlow
    module External
      class ExternalRequestersController < BaseController
        before_action :set_requester, only: %i[show update update_password]
        load_ability :external_requester

        def me
          render json: current_user, serializer: ::V3::External::ExternalRequesterSerializer::Me, status: :ok
        end

        def show
          authorize! :read, @requester

          render json: @requester, serializer: ::V3::External::ExternalRequesterSerializer::Show, status: :ok
        end

        def update
          authorize! :update, @requester

          @requester.update!(update_params)
          @requester.address.update!(address_params)

          render json: @requester, serializer: ::V3::External::ExternalRequesterSerializer::Show, status: :ok
        end

        def update_password
          authorize! :update, @requester

          @requester.update_password(password_params)

          render json: @requester, serializer: ::V3::External::ExternalRequesterSerializer::Show, status: :ok
        end

        private

        def set_requester
          @requester = @organization.external_requesters.find(params[:id] || params[:external_requester_id])
        end

        def password_params
          params.permit(:current_password, :password, :password_confirmation)
        end

        def address_params
          params.require(:address).permit(:street, :number, :complement, :postal_code, :city, :state, :neighborhood)
        end

        def update_params
          params.require(:external_requester).permit(:name, :email, :phone, :optional_phone,
                                                     :optional_email, :occupation, :notification)
        end
      end
    end
  end
end
