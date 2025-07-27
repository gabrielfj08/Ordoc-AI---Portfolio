module FlowServices
  class ProcedureTemplateCreator < ApplicationService
    attr_reader :procedure_template
    
    def initialize(params)
      @user = User.find(params[:user_id])
      @procedure_template = Flow::ProcedureTemplate.new(params[:procedure_template_params])
    end
    
    def call
      ActiveRecord::Base.transaction do
        @procedure_template.save!
        # @procedure_template.histories.create!(user: @user, attributes_before: @procedure_template.attributes, action: :created)
      end
      
      @procedure_template
    end    
  end
end
