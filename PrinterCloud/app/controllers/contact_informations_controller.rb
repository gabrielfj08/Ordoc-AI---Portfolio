class ContactInformationsController < BaseController
  before_action :set_contact_information

  def show
    authorize! :read, @contact_information
    render json: @contact_information, status: :ok
  end

  def update
    authorize! :update, @contact_information
    @contact_information.update!(contact_params)
    render json: @contact_information, status: :ok
  end

  private

  def set_contact_information
    @contact_information = ContactInformation.find(params[:id])
    authorize! :read, @contact_information
  end

  def contact_params
    params.require(:contact_information).permit(:name, :cnpj, :site, :address, :contact_name, :phone, :email,
                                                :whatsapp, :system_name)
  end
end
