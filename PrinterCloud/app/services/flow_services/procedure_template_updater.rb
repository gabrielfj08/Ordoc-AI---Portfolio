module FlowServices
  class ProcedureTemplateUpdater < ApplicationService
    attr_reader :procedure_template

    def initialize(params)
      @user = User.find(params[:user_id])
      @update_params = params[:procedure_template_params]
      @procedure_template = Flow::ProcedureTemplate.find(params[:procedure_id])
    end

    def call
      ActiveRecord::Base.transaction do
        # history = @procedure_template.histories.new(user: @user, attributes_before: @procedure_template.attributes, action: :updated)
        @procedure_template.update!(@update_params)
        # history.attributes_after = @procedure_template.attributes
        # history.save!
      end

      @procedure_template
    end    
  end
end
