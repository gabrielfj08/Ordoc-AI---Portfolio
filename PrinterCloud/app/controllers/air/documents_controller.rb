module Air
  class DocumentsController < BaseController
    before_action :set_directory, only: [:index, :create, :move]
    before_action :set_document, only: [:show, :update, :destroy, :really_destroy]
    before_action :update_accessed_document, only: [:show, :update, :move, :destroy]
    load_ability :document, :directory

    def index
      authorize! :read, @directory

      documents = @directory.documents.not_trashed.kept
                                      .filter_by(filter_params)
                                      .order_by(order_params)
                                      .accessible_by(current_ability)

      render json: documents.paginate(page: page), each_serializer: DocumentSerializer::Base, status: :ok
    end

    def create
      document = @directory.documents.create!(create_params)
      document.department_id = @directory.department_id
      document.file.attach(params[:file])
      document.enqueue! unless skip_ocr?
      render json: document, serializer: DocumentSerializer::Show, status: :ok
    end

    def update
      authorize! :update, @document

      @document.update(update_params)

      render json: @document, serializer: DocumentSerializer::Show, status: :ok
    end

    def show
      authorize! :read, @document
      render json: @document, serializer: DocumentSerializer::Show, status: :ok
    end

    def destroy
      authorize! :update, @document
      @document.trash! current_user

      render json: @document, serializer: DocumentSerializer::Show, status: :ok
    end

    def move
      @document = @directory.documents.find(params[:document_id])
      authorize! :move, @document

      @to_directory = Directory.find(params[:to_directory_id])
      authorize! :read, @to_directory
      @document.update!(directory: @to_directory)

      render json: @document, serializer: DocumentSerializer::Show, status: :ok
    end

    def search
      department_ids = params[:department_ids] ||
        current_user.departments.pluck(:id) & Department.where(organization_id: params[:organization_id]).pluck(:id)

      uri = URI(ENV['SOLR_URL'] + '/solr/documents/query')
      uri.query = URI.encode_www_form({
        'fl'    => 'id',
        'fq'    => "department_id:(#{department_ids.join(' ')})",
        'hl'    => 'true',
        'hl.fl' => 'content',
        'q'     => params['q']      || '*:*',
        'q.op'  => params['q.op']   || 'OR',
        'rows'  => params['rows']   || 20,
        'sort'  => params['sort']   || 'score desc',
        'start' => params['start']  || 0,
      }).concat('&fq=-trashed_at:*')

      response = Net::HTTP.get(
        uri,
        {
          'Content-Type' => 'application/json',
          'Authorization' => 'Basic ' + credentials,
        }
      )

      if JSON.parse(response)['responseHeader']['status'] == 0
        @documents = Document.kept
                             .not_trashed
                             .where(id: JSON.parse(response)['response']['docs']
                             .map { |doc| doc['id'].to_i })

        render json: @documents, meta: { total: JSON.parse(response)['response']['numFound'] }, each_serializer: DocumentSerializer::List, highlighting: JSON.parse(response)['highlighting'], adapter: :json, status: :ok
      else
        render json: [], status: :bad_request
      end
    end

    def dismax_search
      department_ids = params[:department_ids] ||
        current_user.departments.pluck(:id) & Department.where(organization_id: params[:organization_id]).pluck(:id)

      uri = URI(ENV['SOLR_URL'] + '/solr/documents/query')
      uri.query = URI.encode_www_form({
        'defType' => 'dismax',
        'fl'      => 'id',
        'fq'      => "department_id:(#{department_ids.join(' ')})",
        'hl'      => 'true',
        'hl.fl'   => 'content',
        'q'       => params['q']      || '',
        'q.alt'   => params['q.alt']  || '*:*',
        'q.op'    => params['q.op']   || 'OR',
        'qf'      => params['q.qf']   || 'original_filename^100 description location content^10',
        'rows'    => params['rows']   || 20,
        'sort'    => params['sort']   || 'score desc',
        'start'   => params['start']  || 0,
      }).concat('&fq=-trashed_at:*')

      response = Net::HTTP.get(
        uri,
        {
          'Content-Type' => 'application/json',
          'Authorization' => 'Basic ' + credentials,
        }
      )

      if JSON.parse(response)['responseHeader']['status'] == 0
        @documents = Document.kept
                             .not_trashed
                             .where(id: JSON.parse(response)['response']['docs']
                             .map { |doc| doc['id'].to_i })

        render json: @documents, meta: { total: JSON.parse(response)['response']['numFound'] }, each_serializer: DocumentSerializer::List, highlighting: JSON.parse(response)['highlighting'], adapter: :json, status: :ok
      else
        render json: [], status: :bad_request
      end
    end

    def shared_documents
      documents = Document.kept
                          .not_trashed
                          .accessible_by(current_ability)
                          .filter_by_shared_documents(current_user)
                          .order_by(order_params)
                          .paginate(page: page)

      render json: documents, each_serializer: DocumentSerializer::Shared, current_user: current_user, status: :ok
    end

    def show_shared_document
      @document = Document.not_trashed.kept.filter_by_shared_documents(current_user).find(params[:id])
      authorize! :read, @document

      render json: @document, serializer: DocumentSerializer::Shared, current_user: current_user, status: :ok
    end

    private

    def create_params
      params.require(:document)
            .permit(:description, :location)
            .merge(original_filename: params[:file].original_filename)
            .merge(created_by: current_user)
    end

    def path_params
      params.require(:to).permit(:directory_id)
    end

    def set_document
      @document = Document.kept.find(params[:id])
    end

    def filter_params
      params.permit(:name, :organization_id, :created_by_id, :updated_by_id, created_at: [:gte, :lte], updated_at: [:gte, :lte])
    end

    def ocr?
      params[:ocr].to_s == 'true'
    end

    def order_params
      params.permit(:order, :direction)
    end

    def page
      params[:page].to_i.zero? ? 1 : params[:page].to_i
    end

    def set_directory
      @directory = Directory.find(params[:directory_id])
      authorize! :read, @directory
    end

    def skip_ocr?
      params[:skip_ocr].to_s == 'true'
    end

    def update_accessed_document
      return if @document.nil?
  
      @document.recent_documents.find_or_create_by(user_id: current_user.id).touch
    end

    def update_params
      params.require(:document).permit(:description, :location, :original_filename).merge!(updated_by: current_user)
    end

    def credentials
      Base64::encode64("#{username}:#{password}")
    end

    def username
      Rails.application.credentials.dig(:solr, :username)
    end

    def password
      Rails.application.credentials.dig(:solr, :password)
    end
  end
end
