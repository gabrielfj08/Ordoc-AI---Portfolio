module PrinterFlowServices
  class TaskCreator < ApplicationService
    def initialize(params)
      @create_params = params
      return unless params[:task_template_id].present?

      @task_template = ::PrinterFlow::TaskTemplate.find(params[:task_template_id])
    end

    def call
      task = ::PrinterFlow::Task.create!(@create_params)

      if @task_template
        @task_template.task_fields.each do |template_field|
          ::PrinterFlow::TaskField.create!(label: template_field.label, field_type: template_field.field_type,
                                           options: template_field.options, fieldable: task)
        end
      end
      task
    end
  end
end
