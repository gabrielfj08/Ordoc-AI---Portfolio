module PrinterFlowServices
  class RequesterDeactivator < ApplicationService
    def initialize(params)
      @requester = params[:requester]
      @created_by = params[:created_by]
      @note = params[:note]
      @action = params[:action]
    end

    def call
      ActiveRecord::Base.transaction do
        PrinterFlow::JustificationNote.create!(note: @note,
                                               created_by: @created_by,
                                               justifiable_id: @requester.id,
                                               justifiable_type: 'PrinterFlow::Requester',
                                               action: @action)

        @requester.inactivate
      end

      @requester
    end
  end
end
