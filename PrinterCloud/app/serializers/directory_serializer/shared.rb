module DirectorySerializer
  class Shared < Base
    attribute(:shared_at) { @instance_options[:current_user]&.permissions&.where(directory: object)&.first&.created_at }
    attribute(:shared_by) { @instance_options[:current_user]&.permissions&.where(directory: object)&.first&.permission_granted_by&.name }
    attribute(:scope) { @instance_options[:current_user]&.permissions&.where(directory: object)&.first&.scope }     
  end
end
