module V3
  module PrinterFlow
    module External
      class SignaturesController < BaseController
        before_action :set_signature, only: %i[show sign refuse]
        load_ability :signature

        def index
          signatures = @organization.signatures
                                    .includes(:signable)
                                    .accessible_by(current_ability)
                                    .filter_by(filter_params)
                                    .order_by(order_params)
                                    .paginate(page: params[:page], per_page: params[:per_page])

          render json: signatures, meta: { total: signatures.total_entries },
                 each_serializer: ::V3::External::SignatureSerializer::List, adapter: :json, status: :ok
        end

        def show
          authorize! :read, @signature

          render json: @signature, serializer: ::V3::External::SignatureSerializer::Show, status: :ok
        end

        def sign
          authorize! :update, @signature
          @signature.run!

          render json: @signature, serializer: ::V3::External::SignatureSerializer::Show, status: :ok
        end

        def refuse
          authorize! :update, @signature

          signature = ::PrinterFlowServices::SignatureRefuser.new({ signature: @signature,
                                                                    created_by_id: current_user.id,
                                                                    note: params[:note],
                                                                    action: params[:action] }).call

          render json: signature, serializer: ::V3::External::SignatureSerializer::Show, status: :ok
        end

        private

        def set_signature
          @signature = @organization.signatures.find(params[:id] || params[:signature_id])
        end

        def filter_params
          Signable.map_params(params.permit(:signable_type, :signable_id, :requester_id, :created_by_id, :procedure_id, created_at: %i[gte lte],
                                                                                                                        status: []))
        end

        def order_params
          params.permit(:order, :direction)
        end
      end
    end
  end
end
