module PrinterCloud
  class PolicyActionAssignment < ApplicationRecord
    self.table_name = 'printer_cloud.policy_action_assignments'

    belongs_to :policy, class_name: 'PrinterCloud::Policy', foreign_key: 'policy_id'
    belongs_to :policy_action, class_name: 'PrinterCloud::PolicyAction', foreign_key: 'policy_action_id'
  end
end
