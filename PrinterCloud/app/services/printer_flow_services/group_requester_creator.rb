module PrinterFlowServices
  class GroupRequesterCreator < ApplicationService
    def initialize(params)
      @i = 1
      @name = params[:name]
      @organization = Organization.find(params[:organization_id])
      @parent_group_id = params[:parent_group_id]
      @parent_group_code = ::PrinterFlow::GroupRequester.where(id: params[:parent_group_id]).pluck(:code).first
    end

    def call
      ActiveRecord::Base.transaction do
        @group_requester = @organization.group_requesters.create!(name: @name, parent_group_id: parent_group_id)
        @group_requester.update!(code: group_code)
        @group_requester
      end
    rescue ActiveRecord::RecordInvalid => e
      raise unless @group_requester.errors.include?(:code)

      @i += 1
      retry
    end

    private

    def parent_group_id
      parent_group = PrinterFlow::GroupRequester.find_by(id: @parent_group_id)

      parent_group.present? ? parent_group.id : nil
    end

    def group_code
      if parent_group_id.nil?
        "#{@i}"
      else
        "#{@parent_group_code}.#{@i}"
      end
    end
  end
end
