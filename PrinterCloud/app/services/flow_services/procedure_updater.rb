module FlowServices
  class ProcedureUpdater < ApplicationService
    attr_reader :procedure

    def initialize(params)
      @user = User.find(params[:user_id])
      @update_params = params[:procedure_params]
      @procedure = Flow::Procedure.draft.find(params[:procedure_id])
    end

    def call
      ActiveRecord::Base.transaction do
        history = @procedure.histories.new(user: @user, attributes_before: @procedure.attributes, action: :updated)
        @procedure.update!(@update_params)
        history.attributes_after = @procedure.attributes
        history.save!
      end

      @procedure
    end    
  end
end
