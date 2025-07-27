module V3
  module PrinterFlow
    module External
      class FieldsController < BaseController
        before_action :set_procedure_template, only: %i[index show]
        before_action :set_field, only: %i[show]
        load_ability :field

        def index
          fields = @procedure_template.fields
                                      .preload(:field_document_template)
                                      .preload(:field_value_options)
                                      .accessible_by(current_ability)
                                      .filter_by(filter_params)
                                      .search_by(params[:q])
                                      .order_by(order_params)
                                      .paginate(page: params[:page], per_page: params[:per_page])

          render json: fields, meta: { total: fields.total_entries },
                 each_serializer: ::V3::External::FieldSerializer::List, adapter: :json, status: :ok
        end

        def show
          render json: @field, serializer: ::V3::External::FieldSerializer::Show, status: :ok
        end

        private

        def set_procedure_template
          @procedure_template = @organization.procedure_templates.find(params[:procedure_template_id])
        end

        def set_field
          @field = @procedure_template.fields.find(params[:id])
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
end
