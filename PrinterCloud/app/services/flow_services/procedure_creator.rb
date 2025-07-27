module FlowServices
  class ProcedureCreator < ApplicationService
    attr_reader :procedure, :requesters, :beneficiaries
    
    def initialize(params)
      @user = User.find(params[:user_id])
      @procedure = Flow::Procedure.new(params[:procedure_params])
      @procedure_template = Flow::ProcedureTemplate.find(params[:procedure_params][:procedure_template_id])
      @requesters = Flow::Partaker.where(id: params[:requesters_ids])
      @beneficiaries = Flow::Partaker.where(id: params[:beneficiaries_ids])
    end
    
    def call
      ActiveRecord::Base.transaction do
        @procedure.save!
        attach_procedure_template_files
        @procedure.requesters = @requesters
        @procedure.beneficiaries = @beneficiaries
        @procedure.histories.create!(user: @user, attributes_before: @procedure.attributes, action: :created)
      end
      
      @procedure
    end

    def attach_procedure_template_files
      attachments = @procedure_template.attachments
      attachments.each do |attachment|
        procedure_attachment = @procedure.attachments.new({name: attachment.name})
        procedure_attachment.file.attach(io: StringIO.new(attachment.file.download), filename: attachment.file.filename)
        procedure_attachment.save!
      end
    end
  end
end
