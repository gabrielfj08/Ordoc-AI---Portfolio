class DownloadLinksController < BaseController
  before_action :set_download_link, only: %i[show destroy]
  before_action :authorize_target_directories, only: :create
  before_action :authorize_target_documents, only: :create

  def index
    @download_links = current_user.download_links

    render json: @download_links
  end

  def show
    render json: @download_link
  end

  def create
    @download_link = DownloadLink.create!(download_link_params)

    render json: @download_link, status: :created
  end

  def destroy
    @download_link.destroy
  end

  def authorize_target_documents
    return unless documents_ids

    documents = Document.kept.where(id: documents_ids)

    raise CanCan::AccessDenied if documents.count != documents_ids.count

    documents.each do |document|
      authorize! :read, document
    end
  end

  def authorize_target_directories
    return unless directories_ids

    directories = Directory.kept.where(id: directories_ids)

    raise CanCan::AccessDenied if directories.count != directories_ids.count

    directories.each do |directory|
      authorize! :read, directory
    end
  end

  private

  def set_download_link
    @download_link = DownloadLink.find(params[:id])
  end

  def documents_ids
    download_link_params['targets']['documents_ids']
  end

  def directories_ids
    download_link_params['targets']['directories_ids']
  end

  def download_link_params
    params.require(:download_link)
          .permit(
            :name,
            targets: [documents_ids: [], directories_ids: []]
          ).merge(user_id: current_user.id)
  end
end
