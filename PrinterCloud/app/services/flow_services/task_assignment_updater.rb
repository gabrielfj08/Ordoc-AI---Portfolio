module FlowServices
  class TaskAssignmentUpdater < ApplicationService

    def initialize(params)
      @task = Flow::Task.find(params[:task_id])
      @task_assignment = @task.task_assignment
      @body = params[:body]
      @user_id = params[:user_id]
      @user_group_id = params[:user_group_id]
      @user_name = @task_assignment.user.name if @task_assignment.user.present?
    end

    def call
      return @task_assignment if @task_assignment.user_id.equal?(@user_id)
      ActiveRecord::Base.transaction do
        create_task_assigment_note
        @task_assignment.update!(user_id: @user_id, user_group_id: @user_group_id, status: :created)
        @task.start!
      end

      @task_assignment
    end
  
    private

    def create_task_assigment_note
      @task_assignment.notes.create!(body: @body, user_name: @user_name)
    end
  end
end
