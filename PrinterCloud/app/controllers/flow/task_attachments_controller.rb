module Flow
  class TaskAttachmentsController < BaseController
    before_action :set_task, only: [:create, :index, :destroy]
    before_action :set_task_attachment, only: [:show, :update, :destroy, :sign, :restore]
    load_ability :task_attachment, :task
  
    def index
      @task_attachments = @task.attachments.kept
                                           .filter_by(filter_params)
                                           .order_by(order_params)
                                           .accessible_by(current_ability)
                                           .paginate(page: params[:page])

      render json: @task_attachments, status: :ok, each_serializer: TaskAttachmentsSerializer::Base
    end
  
    def show
      render json: @task_attachment, status: :ok, serializer: TaskAttachmentsSerializer::Show
    end
  
    def create
      @task_attachment = @task.attachments.new(create_task_attachment_params)
      authorize! :create, @task_attachment 

      ActiveRecord::Base.transaction do
        @task_attachment.save!
        @task_attachment.file.attach(file_params)

        @task_attachment.histories.create!(user: current_user, action: :created)
      end

      render json: @task_attachment, status: :created, serializer: TaskAttachmentsSerializer::Show
    end
  
    def update
      authorize! :update, @task_attachment 
      @task_attachment.update!(update_task_attachment_params)

      render json: @task_attachment, status: :ok, serializer: TaskAttachmentsSerializer::Show
    end
  
    def destroy
      authorize! :destroy, @task_attachment 
      @task_attachment.discard

      render json: @task_attachment, status: :ok, serializer: TaskAttachmentsSerializer::Show
    end

    def restore
      authorize! :update, @task_attachment 
      @task_attachment.restore

      render json: @task_attachment, status: :ok, serializer: TaskAttachmentsSerializer::Show
    end
    
    private

    def set_task
      @task = Flow::Task.find(params[:task_id])
      authorize! :read, @task
    end

    def set_task_attachment
      @task_attachment = Flow::TaskAttachment.kept.find(params[:id])
      authorize! :read, @task_attachment
    end

    def filter_params
      params.permit(:task_id)
    end

    def order_params
      params.permit(:order, :direction)
    end

    def order_params
      params.permit(:order, :direction)
    end
    
    def file_params
      params.require(:task_attachment).require(:file)
    end
  
    def create_task_attachment_params
      params.require(:task_attachment)
            .permit
            .merge({ name: file_params.original_filename })
    end

    def update_task_attachment_params
      params.require(:task_attachment).permit(:name)
    end
  end
end
