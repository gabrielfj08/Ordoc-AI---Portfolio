module PrinterCloudServices
  class OrganizationSetterUp
    def initialize(params)
      @organization = Organization.find(params[:organization_id])
      @user = PrinterCloud::User.find(params[:user_id])
      @apps = params[:apps]
    end

    def call!
      ActiveRecord::Base.transaction do
        add_apps
        create_user
        create_default_policies
        create_printer_flow_policy if @apps.include?('printer_flow')
        set_up_manager_user_group
        send_user_password
      end

      @organization
    end

    private

    def add_apps
      @organization.apps << App.where(service: @apps)
    end

    def create_user
      @new_user = @organization.printer_cloud_users.create!(name: @user.name, username: @user.username,
                                                            cpf: @user.cpf, email: @user.email, phone: @user.phone, avatar_url: @user.avatar_url,
                                                            date_of_birth: @user.date_of_birth, password: RandomPassword.generate)
    end

    def create_default_policies
      my_air_policy = @organization.policies.create!(name: 'PrinterAirAcesso', description: 'Fornece acesso para listar e visualizar o Meu Air.',
                                                     resource: ["prn:printer_air:#{@organization.cnpj}:Meu Air/"], source: :printer_cloud_managed,
                                                     service: :printer_air, effect: :allow)
      my_air_policy.actions << PrinterCloud::PolicyAction.where(resource: 'directory', service: :printer_air,
                                                                action: %i[read list])

      @printer_cloud_manager_policy = @organization.policies.create!(name: 'PrinterCloudAcessoGerente',
                                                                     description: 'Fornece acesso total aos recursos - usuários, grupos e permissões - do Printer Cloud).',
                                                                     resource: ["prn:printer_cloud:#{@organization.cnpj}:*",
                                                                                "prn:printer_cloud:#{@organization.cnpj}",
                                                                                "prn:printer_reports:#{@organization.cnpj}:*"],
                                                                     source: :printer_cloud_managed, service: :printer_cloud, effect: :allow)
      @printer_cloud_manager_policy.actions << PrinterCloud::PolicyAction.where(service: %i[printer_cloud
                                                                                            printer_reports])

      @printer_air_manager_policy = @organization.policies.create!(name: 'PrinterAirAcessoGerente', description: 'Fornece acesso total a todos os arquivos e pastas do
                                                               Printer Air, incluindo Meu Air e Lixeira.', resource: ["prn:printer_air:#{@organization.cnpj}:Meu Air/*",
                                                                                                                      "prn:printer_air:#{@organization.cnpj}:Lixeira/*"],
                                                                   source: :printer_cloud_managed, service: :printer_air, effect: :allow)
      @printer_air_manager_policy.actions << PrinterCloud::PolicyAction.where(service: :printer_air)
    end

    def create_printer_flow_policy
      @printer_flow_manager_policy = @organization.policies.create!(name: 'PrinterFlowAcessoGerente',
                                                                    description: 'Fornece acesso total aos recursos do Printer Flow.',
                                                                    resource: ["prn:printer_flow:#{@organization.cnpj}:*"],
                                                                    source: :printer_cloud_managed, service: :printer_flow, effect: :allow)
      @printer_flow_manager_policy.actions << PrinterCloud::PolicyAction.where(service: :printer_flow)
    end

    def set_up_manager_user_group
      @manager_group = PrinterCloud::UserGroup.create!(name: 'Gerente', description: 'Grupo de permissões para gerentes da instituição.',
                                                       organization_id: @organization.id)
      @manager_group.policies << [@printer_air_manager_policy,
                                  @printer_cloud_manager_policy]
      @manager_group.policies << @printer_flow_manager_policy if @apps.include?('printer_flow')

      @manager_group.users << @new_user
    end

    def send_user_password
      @new_user.send_random_password_sms
    end
  end
end
