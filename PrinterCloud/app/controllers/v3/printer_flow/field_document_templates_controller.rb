module V3
  module PrinterFlow
    class FieldDocumentTemplatesController < BaseController
      before_action :set_field_document_template, only: [:show]

      def index
        field_document_templates = @organization.field_document_templates
                                                .filter_by(filter_params)
                                                .search_by(params[:q])
                                                .order_by(order_params)
                                                .paginate(page: params[:page], per_page: params[:per_page])

        render json: field_document_templates, meta: { total: field_document_templates.count },
               each_serializer: ::V3::FieldDocumentTemplateSerializer::List, adapter: :json, status: :ok
      end

      def create
        field_document_template = @organization.field_document_templates.create!(create_params)

        render json: field_document_template, serializer: ::V3::FieldDocumentTemplateSerializer::Show,
               status: :created
      end

      def show
        render json: @field_document_template, serializer: ::V3::FieldDocumentTemplateSerializer::Show,
               status: :ok
      end

      def destroy; end

      private

      def set_field_document_template
        @field_document_template = @organization.field_document_templates.find(params[:id])
      end

      def create_params
        params.require(:field_document_template).permit(:name, :s3_key).merge!(created_by_id: current_user.id)
      end

      def order_params
        params.permit(:order, :direction)
      end

      def filter_params
        params.permit(status: [])
      end
    end
  end
end
