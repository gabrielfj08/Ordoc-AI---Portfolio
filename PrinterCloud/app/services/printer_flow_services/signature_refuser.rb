module PrinterFlowServices
  class SignatureRefuser < ApplicationService
    def initialize(params)
      @signature = params[:signature]
      @created_by_id = params[:created_by_id]
      @note = params[:note]
      @action = params[:action]
    end

    def call
      @signature.justification_notes.create!(created_by_id: @created_by_id,
                                             note: @note,
                                             action: @action)

      @signature.refuse!

      @signature
    end
  end
end
