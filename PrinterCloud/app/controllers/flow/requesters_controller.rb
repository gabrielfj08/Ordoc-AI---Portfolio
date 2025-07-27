module Flow
  class RequestersController < BaseController
    before_action :set_procedure
    load_ability :procedure

    def index
      render json: @procedure.requesters, status: :ok
    end

    private

    def set_procedure
      @procedure = Flow::Procedure.kept.find(params[:procedure_id])
      authorize! :read, @procedure
    end
  end
end
