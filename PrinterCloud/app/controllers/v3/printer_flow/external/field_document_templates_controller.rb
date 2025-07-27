module V3
  module PrinterFlow
    module External
      class FieldDocumentTemplatesController < BaseController
        before_action :set_field_document_template, only: [:show]
        load_ability :field_document_template

        def index
          field_document_templates = @organization.field_document_templates
                                                  .accessible_by(current_ability)
                                                  .search_by(params[:q])
                                                  .order_by(order_params)
                                                  .paginate(page: params[:page], per_page: params[:per_page])

          render json: field_document_templates, meta: { total: field_document_templates.total_entries },
                 each_serializer: ::V3::External::FieldDocumentTemplateSerializer::List, adapter: :json, status: :ok
        end

        def show
          authorize! :read, @field_document_template

          render json: @field_document_template, serializer: ::V3::External::FieldDocumentTemplateSerializer::Show,
                 status: :ok
        end

        private

        def set_field_document_template
          @field_document_template = @organization.field_document_templates.find(params[:id])
        end

        def order_params
          params.permit(:order, :direction)
        end
      end
    end
  end
end
