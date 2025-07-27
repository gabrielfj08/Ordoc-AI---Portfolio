module Flow
  class ProcedurePdfsController < BaseController
    before_action :set_base_url, only: [:create]
    before_action :set_procedure, only: [:create, :show]
    before_action :set_procedure_pdf, only: [:show]
    load_ability :procedure

    attr_accessor :procedure

    def create
      authorize! :read, @procedure

      @procedure_pdf = Flow::ProcedurePdf.create!(procedure_id: @procedure.id, name: @procedure.name)

      render json: @procedure_pdf, serializer: ProcedurePdfSerializer::Base, status: :ok
    end

    def show
      authorize! :read, @procedure

      render json: @procedure_pdf, serializer: ProcedurePdfSerializer::Show, status: :ok
    end

    private

    def set_procedure
      @procedure = Flow::Procedure.kept
                                  .preload(:beneficiaries, :archiving_notes, :tasks, :requesters, :attachments)
                                  .find(params[:procedure_id])
    end

    def set_procedure_pdf
      @procedure_pdf = Flow::ProcedurePdf.find(params[:id])
    end

    def set_base_url
      @base_url = self.request.base_url
    end
  end
end
