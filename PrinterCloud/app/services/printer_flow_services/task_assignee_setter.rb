module PrinterFlowServices
  class TaskAssigneeSetter < ApplicationService
    def initialize(params)
      @task = params[:task]
      @group_assignee = params[:group_assignee]
    end

    def call
      if @task.group_assignee.present?
        raise Error::CustomError.new(:unprocessable_entity, 422,
                                     I18n.t('printer_flow.errors.messages.unauthorized_to_set_assignee'))
      end

      ActiveRecord::Base.transaction do
        @task.update!(group_assignee: @group_assignee)
        @task.run!
        @task
      end
    end
  end
end
