module FlowServices
  class TaskAssignmentAccepter < ApplicationService
    
    def initialize(params)
      @user = User.find(params[:user_id])
      @assignee = User.where(id: params[:user_id])
      @task = Flow::Task.find(params[:task_id])
      @user_group = @task.user_group
      @task_assignment = @task.task_assignment
    end
    
    def call!
      validate!

      ActiveRecord::Base.transaction do
        task_history = @task.histories.new(user: @user, attributes_before: @task.attributes, action: :accepted)
        @task_assignment.accept!
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
  end
end
