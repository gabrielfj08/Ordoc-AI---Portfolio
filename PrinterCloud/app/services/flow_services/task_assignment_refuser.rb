module FlowServices
  class TaskAssignmentRefuser < ApplicationService
    
    def initialize(params)
      @user = User.find(params[:user_id])
      @assignee = User.where(id: params[:user_id])
      @task = Flow::Task.find(params[:task_id])
      @task_assignment = @task.task_assignment
      @refusing_note_params = params[:refusing_note_params]
      @user_group = @task.user_group
    end
    
    def call!
      validate!

      ActiveRecord::Base.transaction do
        task_history = @task.histories.new(user: @user, attributes_before: @task.attributes, action: :refused)
        @task_assignment.refuse!
        create_refusing_note
        @task_assignment.update!(user_id: @user.id)
        task_history.attributes_after = @task.attributes
        task_history.save!
      end

      return @procedure
    end

    private

    def validate!
      raise Error::UserMustBeTaskAssigneeError unless @assignee.present?
      if @task.user_group.present?
        raise Error::UserMustBeTaskAssigneeError unless @user_group.users.include?(@user)
      else
        raise Error::UserMustBeTaskAssigneeError unless @task_assignment.user == @user
      end
    end

    def create_refusing_note
      Flow::RefusingNote.create!(@refusing_note_params)
    end
  end
end
