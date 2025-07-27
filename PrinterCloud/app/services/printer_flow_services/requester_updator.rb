module PrinterFlowServices
  class RequesterUpdator < ApplicationService
    def initialize(params)
      @requester = PrinterFlow::Requester.where.not(type: 'PrinterFlow::GroupRequester').find(params[:requester_id])
      @update_params = params[:update_params]
      @address_params = params[:address_params]
    end

    def call!
      ActiveRecord::Base.transaction do
        @requester.update!(@update_params)
        update_address

        @requester
      end
    end

    private

    def update_address
      return if @address_params.empty?

      if @requester.address.present?
        @requester.address.update!(@address_params)
      else
        @requester.create_address(@address_params)
      end
    end
  end
end
