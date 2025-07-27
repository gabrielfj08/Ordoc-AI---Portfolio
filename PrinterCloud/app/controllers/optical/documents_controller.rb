module Optical
  class DocumentsController < BaseController
    load_ability :document

    def create
      @document = current_user.inbox.documents.create!(create_document_params)
      authorize! :create, @document
      @document.file.attach(params[:file])
      @document.enqueue! app: :optical
      render json: @document, serializer: DocumentSerializer::Optical::Show, status: :ok
    end

    def create_batch
      @documents = []

      create_documents_params.each do |file|
        file = file[1] if file.class.eql?(Array)
        next unless file.class.eql?(ActionDispatch::Http::UploadedFile)

        @document = current_user.inbox.documents.create!(original_filename: file.original_filename, created_by: current_user)
        authorize! :create, @document
        @document.file.attach(file)
        @document.enqueue! app: :optical
        @documents << @document
      end

      render json: @documents, each_serializer: DocumentSerializer::Optical::Show, status: :ok
    end

    def move
      @document = current_user.inbox.documents.find(params[:document_id])
      authorize! :update, @document

      path = PrinterCloud::Path.new(@document, path_params)
      authorize! :read, path.destination
      PrinterCloud::FileSystem.move(@document, path: path)

      render json: @document, serializer: DocumentSerializer::Show, status: :ok
    end

    def move_batch
      @documents = current_user.inbox.documents.where(id: params[:document_ids])

      raise CanCan::AccessDenied if @documents.count != params[:document_ids].count

      @documents.each do |document|
        authorize! :update, document
        path = PrinterCloud::Path.new(document, path_params)
        authorize! :read, path.destination
        PrinterCloud::FileSystem.move(document, path: path)
      end

      render json: @documents, each_serializer: DocumentSerializer::Show, status: :ok
    end

    private

    def create_document_params
      params.require(:file)

      { original_filename: params[:file].original_filename,
        created_by: current_user }
    end

    def create_documents_params
      params.require(:files)
    end

    def path_params
      params.require(:to).permit(:directory_id)
    end
  end
end
