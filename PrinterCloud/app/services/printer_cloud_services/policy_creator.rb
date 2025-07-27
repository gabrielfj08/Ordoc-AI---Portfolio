module PrinterCloudServices
  class PolicyCreator < ApplicationService
    def initialize(params)
      @policy_actions = ::PrinterCloud::PolicyAction.where(id: params[:action_ids])
      @create_params = params[:create_params]
    end

    def call
      ActiveRecord::Base.transaction do
        policy = ::PrinterCloud::Policy.create!(@create_params)
        if @policy_actions.empty?
          raise Error::CustomError.new(:unprocessable_entity, 422,
                                       I18n.t('activerecord.errors.messages.attribute_required', attribute: PrinterCloud::PolicyAction.model_name.human))
        end

        policy.actions = @policy_actions
        policy
      end
    end
  end
end
