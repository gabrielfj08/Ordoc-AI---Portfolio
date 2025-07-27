module DocumentSerializer
  class Recent < Base
    attribute(:last_accessed_at) { @instance_options[:current_user]&.recent_documents&.where(document: object)&.first&.updated_at }
  end
end