module V2
  module Air
    module DepartmentMember
      class DocumentsController < BaseController
        before_action :set_document, only: [:update]

        def update
          @document.update(update_params)

          render json: @document, serializer: DocumentSerializer::Show, satus: :ok
        end

        private

        def set_document
          @document = @department.documents.find(params[:id])
        end

        def update_params
          params.require(:document)
                .permit(:description, :location, :original_filename)
                .merge(updated_by_id: current_user.id)
        end
      end
    end
  end
end
