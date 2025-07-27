module ProcedureTemplateSerializer
  class List < Base
    attribute(:attachments_count) { object.attachments.count }
  end
end
