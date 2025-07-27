module PrinterCloudServices
  class OrganizationCreator
    def initialize(params)
      @organization_params = params[:create_params]
      @address_params = params[:address_params]
    end

    def call
      ActiveRecord::Base.transaction do
        @organization = Organization.create!(@organization_params)
        @organization.create_address(@address_params)
        @organization.create_recycle_bin_directory(created_by_id: ENV['PRINTER_CLOUD_USER_ID'],
                                                   updated_by_id: ENV['PRINTER_CLOUD_USER_ID'])
        @organization.create_root_directory(created_by_id: ENV['PRINTER_CLOUD_USER_ID'],
                                            updated_by_id: ENV['PRINTER_CLOUD_USER_ID'])
        @organization.create_default_reports
        @organization.save!
        create_deny_policy_for_printer_flow_directory
        @organization
      end
    end

    private

    def create_deny_policy_for_printer_flow_directory
      policy = PrinterCloud::Policy.create!(name: 'PrinterFlowDenyDirectory', description: 'Permissão de negação para ações nos diretórios do Printer Flow.',
                                            organization_id: @organization.id, effect: 'deny', source: 'printer_cloud_managed', service: :printer_air,
                                            resource: ["prn:printer_air:#{@organization.cnpj}:Meu Air/Printer Flow - Private/",
                                                       "prn:printer_air:#{@organization.cnpj}:Meu Air/Printer Flow - Private/*",
                                                       "prn:printer_air:#{@organization.cnpj}:Meu Air/Printer Flow/",
                                                       "prn:printer_air:#{@organization.cnpj}:Meu Air/Printer Flow/*"])

      policy.actions << PrinterCloud::PolicyAction.where(service: 'printer_air', resource: 'directory')
    end
  end
end
