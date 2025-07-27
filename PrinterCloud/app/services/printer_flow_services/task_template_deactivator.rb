module PrinterFlowServices
  class TaskTemplateDeactivator < ApplicationService
    def initialize(params)
      @task_template = params[:task_template]
      @created_by = params[:created_by]
      @note = params[:note]
      @action = params[:action]
    end

    def call
      ActiveRecord::Base.transaction do
        ::PrinterFlow::JustificationNote.create!(note: @note,
                                                 created_by: @created_by,
                                                 justifiable_id: @task_template.id,
                                                 justifiable_type: 'PrinterFlow::TaskTemplate',
                                                 action: @action)

        @task_template.deactivate!
      end

      @task_template
    end
  end
end
