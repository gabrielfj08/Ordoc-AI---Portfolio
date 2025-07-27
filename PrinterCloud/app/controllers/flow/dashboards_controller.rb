module Flow
  class DashboardsController < BaseController
    load_ability :procedure, :task

    def index
      result = [
        { data: archived_procedures_count, slug: 'archived_procedures_count' },
        { data: started_procedures_count, slug: 'started_procedures_count' },
        { data: finished_procedures_count, slug: 'finished_procedures_count' },
        { data: assigned_tasks_count, slug: 'assigned_tasks_count' },
        { data: started_tasks_count, slug: 'started_tasks_count' },
        { data: review_tasks_count, slug: 'review_tasks_count' },
        { data: finished_tasks_count, slug: 'finished_tasks_count' },
      ]

      render json: result, status: :ok
    end

    private

    def archived_procedures_count
      Flow::Procedure.kept
                     .archived
                     .filter_by(filter_params)
                     .accessible_by(current_ability)
                     .count
    end

    def started_procedures_count
      Flow::Procedure.kept
                     .started
                     .filter_by(filter_params)
                     .accessible_by(current_ability)
                     .count
    end

    def finished_procedures_count
      Flow::Procedure.kept
                     .finished
                     .filter_by(filter_params)
                     .accessible_by(current_ability)
                     .count
    end

    def assigned_tasks_count
      # TODO: IMPLEMENT ASSIGNED TASKS
      0
    end

    def started_tasks_count
      Flow::Task.kept
                .started
                .filter_by(filter_params)
                .accessible_by(current_ability)
                .count
    end

    def review_tasks_count
      Flow::Task.kept
                .review
                .filter_by(filter_params)
                .accessible_by(current_ability)
                .count
    end

    def finished_tasks_count
      Flow::Task.kept
                .finished
                .filter_by(filter_params)
                .accessible_by(current_ability)
                .count
    end

    private

    def filter_params
      params.permit(:department_id)
    end
  end
end
