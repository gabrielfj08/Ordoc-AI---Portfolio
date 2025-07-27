module Optical
  class BaseController < ::BaseController
    class << self
      def load_ability(*resources)
        self.loaded_ability_resources = resources.map do |resource|
          resource.to_s.classify 
        end
      end
    end

    class_attribute :loaded_ability_resources
    load_ability

    private


    def current_ability
      abilities.reduce(DepartmentMemberAbility.new(current_user)) do |current_ability, ability|
        current_ability.merge(ability.new(current_user))
      end
    end

    def abilities
      self.loaded_ability_resources.map do |resource_class_name|
        ability_class(resource_class_name)
      end
    end

    def ability_class(resource_class_name)
      "Abilities::Optical::#{resource_class_name}".constantize
    end
  end
end
