module V3
  module External
    module ReportSerializer
      class Base < ActiveModel::Serializer
        attributes :id, :external_requester_id, :status, :procedures_running_count, :procedures_started_count,
                   :tasks_running_count, :signatures_pending_count, :shared_procedures_pending_count,
                   :created_at, :updated_at
      end
    end
  end
end
