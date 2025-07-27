module TaskAttachmentSignatureSerializer
  class Base < ActiveModel::Serializer
    attributes :id, :task_attachment_id, :user_id, :signature, :signed_at, :status, :created_at, :updated_at
    belongs_to :task_attachment

    attribute(:procedure_id) { object.task_attachment.task.procedure_id }
    attribute(:procedure_internal_process_number) { object.task_attachment.task.procedure.internal_process_number }
    attribute(:task_id) { object.task_attachment.task_id }
    attribute(:task_name) { object.task_attachment.task.name }

    class TaskAttachmentSerializer < ActiveModel::Serializer
      attributes :name
    end
  end
end
