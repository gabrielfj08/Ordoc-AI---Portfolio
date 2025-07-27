module Authorizable
  extend ActiveSupport::Concern

  class_methods do
    def accessible_by_user(user, action = :list)
      @action = action
      @authorizing_user = user

      accessible_resources
    end

    private

    def accessible_resources
      if deny_policies_resources.empty?
        where("#{table_name}.prn LIKE ANY ( array[?] )", allow_policies_resources)
      else
        where("#{table_name}.prn LIKE ANY ( array[?] )", allow_policies_resources).where.not("#{table_name}.prn LIKE ANY ( array[?] )",
                                                                                             deny_policies_resources)
      end
    end

    def allow_policies_resources
      @authorizing_user.policies.active.filter_by_action_resource(base_class.to_s.demodulize.underscore)
                       .filter_by_action(@action).allow
                       .map(&:resource).flatten.map { |val| val.to_s.gsub('*', '%') } +
        @authorizing_user.user_group_policies.active.filter_by_action_resource(base_class.to_s.demodulize.underscore)
                         .filter_by_action(@action).allow
                         .map(&:resource).flatten.map do |val|
          val.to_s.gsub('*', '%')
        end
    end

    def deny_policies_resources
      @authorizing_user.policies.active.filter_by_action_resource(base_class.to_s.demodulize.underscore)
                       .filter_by_action(@action)
                       .deny.map(&:resource).flatten.map { |val| val.to_s.gsub('*', '%') } +
        @authorizing_user.user_group_policies.active.filter_by_action_resource(base_class.to_s.demodulize.underscore)
                         .filter_by_action(@action)
                         .deny.map(&:resource).flatten.map do |val|
          val.to_s.gsub('*', '%')
        end
    end
  end
end
