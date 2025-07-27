module FlowServices
  class ProcedureDettacher < ApplicationService
    
    def initialize(params)
      @user = User.find(params[:user_id])
      @child_procedure = Flow::Procedure.find(params[:child_procedure_id])
      @procedure = Flow::Procedure.find(params[:procedure_id])
    end
    
    def call
      ActiveRecord::Base.transaction do
        validate_procedure!
        history = @child_procedure.histories.new(user: @user, attributes_before: @child_procedure.attributes, action: :updated)
        @child_procedure.orphanate!
        history.attributes_after = @child_procedure.attributes
        history.save!
      end
      
      return @procedure
    end

    private

    def validate_procedure!
      raise StandarError if @child_procedure.parent != @procedure
      true
    end
  end
end