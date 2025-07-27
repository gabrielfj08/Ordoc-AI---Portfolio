module V3
  module PrinterFlow
    class FieldValueOptionsController < BaseController
      before_action :set_field
      before_action :set_procedure_template
      before_action :set_field_value_option, only: %i[show update destroy]

      def index
        authorize :read, @procedure_template

        field_value_options = @field.field_value_options

        render json: field_value_options, meta: { total: field_value_options.count },
               each_serializer: ::V3::FieldValueOptionSerializer::List, adapter: :json, status: :ok
      end

      def show
        authorize :read, @procedure_template

        render json: @field_value_option, serializer: ::V3::FieldValueOptionSerializer::Show, status: :ok
      end

      def create
        authorize :update, @procedure_template

        field_value_option = @field.field_value_options.create!(create_params)

        render json: field_value_option, serializer: ::V3::FieldValueOptionSerializer::Show, status: :created
      end

      def update
        authorize :update, @procedure_template

        @field_value_option.update!(update_params)

        render json: @field_value_option, serializer: ::V3::FieldValueOptionSerializer::Show, status: :ok
      end

      def destroy
        authorize :update, @procedure_template

        @field_value_option.destroy!

        render json: @field_value_option, serializer: ::V3::FieldValueOptionSerializer::Show, status: :ok
      end

      private

      def create_params
        params.require(:field_value_option).permit(:value)
      end

      def update_params
        params.require(:field_value_option).permit(:value)
      end

      def set_field
        @field = ::PrinterFlow::Field.find(params[:field_id])
      end

      def set_field_value_option
        @field_value_option = @field.field_value_options.find(params[:id])
      end

      def set_procedure_template
        @procedure_template = @field.procedure_template
      end
    end
  end
end
