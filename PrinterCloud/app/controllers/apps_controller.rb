class AppsController < BaseController
  def index
    authorize! :read, App
    apps = App.all
    render json: apps.paginate(page: params[:page]), status: :ok
  end

  def create
    authorize! :create, App
    app = App.create!(app_params)
    render json: app, status: :created
  end

  private

  def app_params
    params.require(:app).permit(:name, :description, :logo)
  end
end
