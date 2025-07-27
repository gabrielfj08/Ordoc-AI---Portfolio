module Flow
  class PartakersController < BaseController
    before_action :set_partaker, only: [:show, :update, :destroy, :activate, :deactivate]
    load_ability :partaker
  
    def index
      @partakers =  Flow::Partaker.filter_by(filter_params)
                                  .order_by(order_params)
                                  .search_by(params[:q])
                                  .accessible_by(current_ability)
                                  .paginate(page: params[:page])

      render json: @partakers, each_serializer: PartakerSerializer::List, status: :ok
    end
  
    def show
      render json: @partaker, serializer: PartakerSerializer::Show, status: :ok
    end
  
    def create
      @partaker = Partaker.new(create_partaker_params)
      authorize! :create, @partaker
      @partaker.save!
  
      render json: @partaker, serializer: PartakerSerializer::Show, status: :created
    end
  
    def update
      authorize! :update, @partaker
      @partaker.update!(update_partaker_params)

      render json: @partaker, serializer: PartakerSerializer::Show, status: :ok
    end
  
    def destroy
      authorize! :destroy, @partaker
      @partaker.destroy!

      render json: @partaker, serializer: PartakerSerializer::Show, status: :ok
    end

    def activate
      authorize! :update, @partaker
      @partaker.activate!

      render json: @partaker, serializer: PartakerSerializer::Show, status: :ok
    end

    def deactivate
      authorize! :update, @partaker
      @partaker.deactivate!

      render json: @partaker, serializer: PartakerSerializer::Show, status: :ok
    end

    private

    def create_partaker_params
      params.require(:partaker).permit(:address, :cpf_cnpj, :email, :name, :notes, :organization_id, :phone)
    end

    def update_partaker_params
      params.require(:partaker).permit(:address, :cpf_cnpj, :email, :name, :notes, :phone)
    end

    def filter_params
      params.permit(:cpf_cnpj, :email, :name, :organization_id, :status)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def set_partaker
      @partaker = Partaker.find(params[:id] || params[:partaker_id])

      authorize! :read, @partaker
    end
  end
end
