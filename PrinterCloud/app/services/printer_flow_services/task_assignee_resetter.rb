module PrinterFlowServices
  class TaskAssigneeResetter < ApplicationService
    def initialize(params)
      @task = params[:task]
      @group_assignee = params[:group_assignee]
      @created_by = params[:created_by]
      @note = params[:note]
      @action = params[:action]
    end

    def call
      ActiveRecord::Base.transaction do
        @task.update!(group_assignee: @group_assignee, assignee_id: nil)
        @task.justification_notes.create!(created_by_id: @created_by.id,
                                          note: @note,
                                          action: @action)
        @task.run!

        @task
      end
    end
  end
end
