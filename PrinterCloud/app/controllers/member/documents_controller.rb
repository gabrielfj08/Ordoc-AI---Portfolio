module Member
  class DocumentsController < BaseController
    before_action :set_directory, except: %i[search shared_documents show_shared_document count_by_organization]
    before_action :set_document, only: %i[move show update destroy really_destroy]
    before_action :update_accessed_document, only: %i[show update move destroy]

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
      document.file.attach(params[:file])
      document.save!
      document.enqueue! unless skip_ocr?
      render json: document, serializer: DocumentSerializer::Show, status: :ok
    end

    def update
      authorize! :update, @document

      @document = AirServices::DocumentUpdator.new({ update_params: update_params, id: @document.id }).call

      render json: @document, serializer: DocumentSerializer::Show, status: :ok
    end

    def show
      authorize! :read, @document
      render json: @document, serializer: DocumentSerializer::Show, status: :ok
    end

    def destroy
      authorize! :update, @document
      @document.trash!(current_user)

      render json: @document, serializer: DocumentSerializer::Show, status: :ok
    end

    def move
      authorize! :update, @document

      @to_directory = Directory.find(params[:to_directory_id])
      authorize! :read, @to_directory
      @document.update!(directory: @to_directory)

      render json: @document, serializer: DocumentSerializer::Show, status: :ok
    end

    def shared_documents
      render json: current_user.shared_documents.not_trashed.order_by(order_params).paginate(page: page), each_serializer: DocumentSerializer::Shared,
             current_user: current_user
    end

    def show_shared_document
      document = current_user.shared_documents.not_trashed.kept.find(params[:id])

      render json: document, serializer: DocumentSerializer::Show, status: :ok
    end

    def really_destroy
      authorize! :update, @document
      @document.destroy!
      render status: :ok, json: @document
    end

    def count_by_organization
      document_count = Document.kept
                               .not_trashed
                               .filter_by_organization_id(params[:organization_id])
                               .accessible_by(current_ability)
                               .count

      render json: { data: document_count }, status: :ok
    end

    private

    def create_params
      params.require(:document)
            .permit(:description, :location)
            .merge(original_filename: params[:file].original_filename.force_encoding('UTF-8').encode('UTF-8',
                                                                                                     invalid: :replace))
            .merge(created_by: current_user, department_id: Directory.find(params[:directory_id]).department.id)
    end

    def path_params
      params.require(:to).permit(:directory_id)
    end

    def current_ability
      @current_ability ||= DepartmentMemberAbility.new(current_user)
    end

    def set_document
      @document = @directory.documents.kept.find(params[:id])
    end

    def filter_params
      params.permit(:name, :organization_id, :created_by_id, :updated_by_id, created_at: %i[gte lte],
                                                                             updated_at: %i[gte lte])
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
  end
end
