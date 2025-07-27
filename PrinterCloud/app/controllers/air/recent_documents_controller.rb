module Air
  class RecentDocumentsController < BaseController
    before_action :set_organization, only: [:index]
    load_ability :organization, :recent_document

    def index
      @recent_documents = RecentDocument.filter_by(filter_params)
                                        .accessible_by(current_ability)
                                        .order_by(order_params)
                                        .paginate(page: params[:page])

      render json: @recent_documents, status: :ok
    end

    private

    def set_organization
      @organization = Organization.find(params[:organization_id])

      authorize! :read, @organization
    end

    def filter_params
      params.permit(:organization_id).merge(user_id: current_user)
    end

    def order_params
      params.permit(:updated_at)
    end
  end
end
