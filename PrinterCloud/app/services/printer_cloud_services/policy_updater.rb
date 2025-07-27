module PrinterCloudServices
  class PolicyUpdater < ApplicationService
    def initialize(params)
      @policy = params[:policy]
      @policy_actions = ::PrinterCloud::PolicyAction.where(id: params[:action_ids])
      @update_params = params[:update_params]
    end

    def call
      ActiveRecord::Base.transaction do
        @policy.update!(@update_params)
        if @policy_actions.empty?
          raise Error::CustomError.new(:unprocessable_entity, 422,
                                       I18n.t('activerecord.errors.messages.attribute_required', attribute: PrinterCloud::PolicyAction.model_name.human))
        end

        @policy.actions = @policy_actions
        @policy
      end
    end
  end
end
