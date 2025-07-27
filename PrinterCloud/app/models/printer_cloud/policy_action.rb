module PrinterCloud
  class PolicyAction < ApplicationRecord
    include Filterable
    include Orderable

    self.table_name = 'printer_cloud.policy_actions'

    ACTIONS = %w[list read create update delete attach_user_to_group attach_policy_to_user add_requester_to_group
                 detach_user_from_group remove_requester_from_group detach_policy_from_user attach_policy_to_group
                 detach_policy_from_group share restore]

    ACCESS_LEVEL = Hash(
      list: 0,
      read: 1,
      write: 2
    )

    SERVICES = Hash(
      printer_cloud: 0,
      printer_air: 1,
      printer_flow: 2,
      printer_reports: 3
    )

    enum access_level: ACCESS_LEVEL
    enum service: SERVICES

    validates :action, inclusion: { in: ACTIONS }
    validates :resource, uniqueness: { scope: %i[service action] }

    has_many :policy_action_assignments, class_name: 'PrinterCloud::PolicyActionAssignment', dependent: :destroy
    has_many :policies, through: :policy_action_assignments

    scope :filter_by_access_level, lambda { |access_level|
                                     where(access_level: access_level.map(&:to_sym) & ACCESS_LEVEL.keys)
                                   }
    scope :filter_by_resource, lambda { |resource|
                                 where(resource: resource)
                               }
    scope :filter_by_service, lambda { |service|
                                where(service: service.map(&:to_sym) & SERVICES.keys)
                              }
  end
end
