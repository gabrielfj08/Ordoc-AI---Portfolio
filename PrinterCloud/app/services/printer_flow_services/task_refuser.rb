module PrinterFlowServices
  class TaskRefuser < ApplicationService
    def initialize(params)
      @task = params[:task]
      @created_by = params[:created_by]
      @note = params[:note]
      @action = params[:action]
    end

    def call
      ActiveRecord::Base.transaction do
        @task.update!(assignee_id: @created_by.id)
        @task.refuse!
        @task.justification_notes.create!(created_by_id: @created_by.id,
                                          note: @note,
                                          action: @action)

        @task
      end
    end
  end
end
