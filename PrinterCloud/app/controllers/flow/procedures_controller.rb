module Flow
  class ProceduresController < BaseController
    before_action :set_procedure, only: [:show, :update, :destroy, :finish, :archive, :unarchive, :set_requesters, :set_beneficiaries, :attach_procedure, :dettach_procedure, :restore]
    load_ability :procedure, :partaker, :user
  
    def index
      @procedures = Flow::Procedure.kept
                                   .includes(:procedure_template)
                                   .includes(:department)
                                   .filter_by(filter_params)
                                   .order_by(order_params)
                                   .search_by(params[:q])
                                   .accessible_by(current_ability)
                                   .paginate(page: params[:page])

      render json: @procedures, each_serializer: ProcedureSerializer::List, status: :ok
    end

    def index_types
      render json: Flow::Procedure.kept.accessible_by(current_ability).only_types.filter_by_department_id(department_id), each_serializer: ProcedureSerializer::Base
    end

    def show
      render json: @procedure, serializer: ProcedureSerializer::Show
    end

    def create
      procedure_creator = FlowServices::ProcedureCreator.new({procedure_params: create_procedure_params,
                                                              user_id: current_user.id,
                                                              requesters_ids: params[:requesters_ids],
                                                              beneficiaries_ids: params[:beneficiaries_ids] })

      authorize! :create, procedure_creator.procedure

      authorize_partakers(procedure_creator.procedure, procedure_creator.beneficiaries)
      authorize_partakers(procedure_creator.procedure, procedure_creator.requesters)

      procedure = procedure_creator.call

      render json: procedure, status: :created, serializer: ProcedureSerializer::Show
    end

    def set_beneficiaries
      authorize! :update, @procedure
      beneficiaries = Flow::Partaker.where(id: params[:beneficiary_ids])

      authorize_partakers(@procedure, beneficiaries)

      @procedure.beneficiaries = beneficiaries

      render json: @procedure, serializer: ProcedureSerializer::Show, status: :ok
    end

    def set_requesters
      authorize! :update, @procedure
      requesters = Flow::Partaker.where(id: params[:requester_ids])

      authorize_partakers(@procedure, requesters)

      @procedure.requesters = requesters

      render json: @procedure, serializer: ProcedureSerializer::Show, status: :ok
    end

    def attach_procedure
      FlowServices::ProcedureAttacher.call({procedure_id: @procedure.id, attaching_procedure_id: child_procedure_id, user_id: current_user.id})
  
      render json: @procedure.reload, status: :ok, serializer: ProcedureSerializer::Show
    end
  
    def dettach_procedure
      FlowServices::ProcedureDettacher.call({procedure_id: @procedure.id, child_procedure_id: child_procedure_id, user_id: current_user.id})
  
      render json: @procedure.reload, status: :ok, serializer: ProcedureSerializer::Show
    end
  
    def update
      procedure_updater = FlowServices::ProcedureUpdater.new({procedure_params: update_procedure_params, user_id: current_user.id, procedure_id: @procedure.id})

      authorize! :update, procedure_updater.procedure

      procedure = procedure_updater.call
  
      render json: procedure, serializer: ProcedureSerializer::Show, status: :ok
    end
  
    def destroy
      authorize! :destroy, @procedure
      @procedure.discard

      render json: @procedure, serializer: ProcedureSerializer::Show, status: :ok
    end

    def finish
      authorize! :finish, @procedure
      @procedure.finish!

      render json: @procedure, serializer: ProcedureSerializer::Show, status: :ok
    end
  
    def archive
      procedure_archiver = FlowServices::ProcedureArchiver.new({user_id: current_user.id, procedure_id: @procedure.id, archiving_notes_params: archiving_notes_params})

      authorize! :archive, procedure_archiver.procedure

      @procedure = procedure_archiver.call

      render json: @procedure, serializer: ProcedureSerializer::Show, status: :ok
    end

    def unarchive
      procedure_unarchiver = FlowServices::ProcedureUnarchiver.new({user_id: current_user.id, procedure_id: @procedure.id, archiving_notes_params: archiving_notes_params})

      authorize! :unarchive, procedure_unarchiver.procedure

      @procedure = procedure_unarchiver.call

      render json: @procedure, serializer: ProcedureSerializer::Show, status: :ok
    end

    def restore
      @procedure.restore

      render json: @procedure, serializer: ProcedureSerializer::Show
    end

    private

    def authorize_partakers(procedure, partakers)
      partakers.each do |partaker|
        authorize! :read, partaker
        raise Error::RequesterCannotJoinProcedureError unless procedure.organization == partaker.organization
      end
    end

    def filter_params
      params.permit(:created_by_id, :department_id, :organization_id, :parent_id, :procedure_template_id, statuses: [])
            .with_defaults(statuses: Flow::Procedure::STATUSES.keys)
    end

    def archiving_notes_params
      params.permit(:procedure_id, :body).merge!(created_by_id: current_user.id)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def child_procedure_id
      params[:child_procedure_id]
    end

    def department_id
      params[:department_id]      
    end

    def partaker_params
      {
        partaker: Flow::Partaker.find(params[:partaker][:partaker_id]),
        partaker_type: params[:partaker][:partaker_type]
      }
    end
  
    def interested_params
      {
        user: User.find(params[:interested][:interested_id]),
        interested_type: params[:interested][:interested_type]
      }
    end
  
    def set_procedure
      @procedure = Flow::Procedure.kept.find(params[:id] || params[:procedure_id])
      authorize! :read, @procedure
    end

    def create_procedure_params
      params.require(:procedure)
            .permit(:description, :name, :public, :department_id, :procedure_template_id, :document_number, :public)
            .merge(created_by_id: current_user.id)
    end
  
    def update_procedure_params
      params.require(:procedure).permit(:description, :document_number, :name, :public)
    end
  end
end
