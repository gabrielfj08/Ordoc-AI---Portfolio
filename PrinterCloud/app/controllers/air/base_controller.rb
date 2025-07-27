module Air
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
      abilities.reduce(Abilities::NullAbility.new) do |current_ability, ability|
        current_ability.merge(ability.new(current_user))
      end
    end

    def abilities
      self.loaded_ability_resources.map do |resource_class_name|
        ability_class(resource_class_name)
      end
    end

    def ability_class(resource_class_name)
      "Abilities::Air::#{role_class_name}::#{resource_class_name}".constantize
    end

    def role_class_name
      params[:role].classify
    end
  end
end
