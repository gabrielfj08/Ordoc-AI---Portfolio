module PrinterCloudServices
  class OrganizationUpdater
    def initialize(params)
      @organization = Organization.kept.find(params[:organization_id])
      @organization_params = params[:update_params]
      @address_params = params[:address_params]
    end

    def call
      ActiveRecord::Base.transaction do
        @organization.update!(@organization_params)
        @organization.address.update(@address_params)

        @organization
      end
    end
  end
end
