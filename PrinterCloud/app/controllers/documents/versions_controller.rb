# frozen_string_literal: true

module Documents
  class VersionsController < BaseController
    before_action :set_document
    before_action :update_accessed_document, only: %i[destroy create index]

    def create
      old_document_attributes = @document.attributes.merge('head_document_id' => @document.id).except('id')
      old_document = Document.new(old_document_attributes)
      old_document.save(validate: false)
      old_document.file.attach(@document.file.blob)
      old_document.processed_file.attach(@document.processed_file.blob) if @document.processed_file.attached?

      update_document_pages(old_document)
      @document.update!(document_params.merge(original_filename: file_params.original_filename, status: :created))
      @document.file.attach(file_params)
      @document.enqueue! unless skip_ocr?

      render json: @document.with_old_versions, status: :ok
    end

    def index
      render json: @document.with_old_versions.search_by(params[:q])
                            .order_by(order_params)
                            .paginate(page: params[:page]),
             each_serializer: DocumentSerializer::Base, status: :ok
    end

    def destroy
      raise Error::NotDocumentVersionError if @document.is_current_version? && !@document.has_previous_versions?

      if @document.is_current_version?
        Document.transaction do
          newst_version = @document.old_versions.order(:created_at).last
          @document.update!(newst_version.attributes.except('id').except('head_document_id'))
          newst_version.discard!
        end
      else
        @document.discard!
      end

      render json: @document, status: :ok
    end

    private

    def set_document
      @document = Document.with_old_versions.find(params[:id])
    end

    def file_params
      params.require(:file)
    end

    def document_params
      params.require(:document).permit(:description, :location).merge(updated_by: current_user)
    end

    def skip_ocr?
      params[:skip_ocr].to_s == 'true'
    end

    def order_params
      params.permit(:order, :direction)
    end

    def update_accessed_document
      unless @document.nil?
        if @document.last_users_accessed.include? current_user
          @document.recent_documents.where(user: current_user)&.first&.touch
        else
          @document.recent_documents.create(user: current_user)
        end
      end
    end

    def update_document_pages(old_document)
      pages = Page.where(document_id: @document.id)
      pages.update_all(document_id: old_document.id)
    end
  end
end
