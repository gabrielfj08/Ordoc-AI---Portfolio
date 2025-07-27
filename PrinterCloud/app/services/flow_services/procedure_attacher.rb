module FlowServices
  class ProcedureAttacher < ApplicationService
    
    def initialize(params)
      @user = User.find(params[:user_id])
      @attaching_procedure = Flow::Procedure.kept.find params[:attaching_procedure_id]
      @procedure_id = params[:procedure_id]
    end
    
    def call
      ActiveRecord::Base.transaction do
        history = @attaching_procedure.histories.new(user: @user, attributes_before: @attaching_procedure.attributes, action: :updated)
        @attaching_procedure.move!(@procedure_id)
        history.attributes_after = @attaching_procedure.attributes
        history.save!
      end
      
      return @attaching_procedure
    end    
  end
end
