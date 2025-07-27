module V3
  module PrinterFlow
    class FieldsController < BaseController
      before_action :set_procedure_template, only: %i[index show create update destroy]
      before_action :set_field, only: %i[show update destroy]

      def index
        authorize :list, @procedure_template

        fields = @procedure_template.fields
                                    .preload(:field_document_template)
                                    .preload(:field_value_options)
                                    .filter_by(filter_params)
                                    .search_by(params[:q])
                                    .order_by(order_params)
                                    .paginate(page: params[:page], per_page: params[:per_page])

        render json: fields, meta: { total: fields.count },
               each_serializer: ::V3::FieldSerializer::List, adapter: :json, status: :ok
      end

      def index_field_types
        field_types = ::PrinterFlow::Field::FIELD_TYPES.keys
                                                       .paginate(page: params[:page], per_page: params[:per_page])

        render json: { field_types: field_types }, status: :ok
      end

      def show
        authorize :read, @procedure_template

        render json: @field, serializer: V3::FieldSerializer::Show, status: :ok
      end

      def create
        authorize :update, @procedure_template

        @field = @procedure_template.fields.create!(create_params)

        render json: @field, serializer: V3::FieldSerializer::Show, status: :created
      end

      def update
        authorize :update, @procedure_template

        @field.update!(update_params)

        render json: @field, serializer: V3::FieldSerializer::Show, status: :ok
      end

      def destroy
        authorize :update, @procedure_template

        @field.destroy!

        render json: @field, serializer: V3::FieldSerializer::Show, status: :ok
      end

      def attach_document_template
        @field = ::PrinterFlow::Field.find(params[:field_id])
        @field_document_template = ::PrinterFlow::FieldDocumentTemplate.find(params[:field_document_template_id])

        @field.field_document_template = @field_document_template

        render json: @field, serializer: V3::FieldSerializer::Show, status: :ok
      end

      def detach_document_template
        @field = ::PrinterFlow::Field.find(params[:field_id])
        field_attachment = ::PrinterFlow::FieldAttachment.find_by!(
          field_document_template_id: params[:field_document_template_id], field_id: params[:field_id]
        )

        field_attachment.destroy!

        render json: @field, serializer: V3::FieldSerializer::Show, status: :ok
      end

      private

      def set_procedure_template
        @procedure_template = @organization.procedure_templates.find(params[:procedure_template_id])
      end

      def set_field
        @field = @procedure_template.fields.find(params[:id])
      end

      def create_params
        params.require(:field).permit(:field_type, :label)
      end

      def update_params
        params.permit(:field_type, :label)
      end

      def filter_params
        params.permit(field_type: [])
      end

      def order_params
        params.permit(:order, :direction)
      end
    end
  end
end
