module FlowServices
  class TaskAssigner < ApplicationService
    
    def initialize(params)

      @user = User.find(params[:user_id])
      @task = Flow::Task.find(params[:task_id])

      @assignable_types = params[:assignable_types]
      @assignable_ids = params[:assignable_ids]
      #TODO Raise custom error
      raise StandardError if @assignable_ids.length != @assignable_types.length
    end
    
    def call
      ActiveRecord::Base.transaction do
        tasks = []
        @assignable_types.each_with_index do |assignable_type,  index|
          if @task.reload.assigned?
            copy_task = Flow::Task.create!(@task.attributes.except!('id').merge(status: :created))
            copy_task.histories.create!(user: @user, attributes_after: copy_task.attributes, action: :created)

            copy_task.assign!(@user, assignable_type.constantize.find(@assignable_ids[index]))
            tasks.append copy_task
          else
            @task.assign!(@user, assignable_type.constantize.find(@assignable_ids[index]))
            tasks.append @task
          end
        end

        return tasks
      end
    end    
  end
end
