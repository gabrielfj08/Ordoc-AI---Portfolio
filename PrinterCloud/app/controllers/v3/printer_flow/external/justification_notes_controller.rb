module V3
  module PrinterFlow
    module External
      class JustificationNotesController < BaseController
        before_action :set_justifiable

        def index
          justification_notes = ::PrinterFlow::JustificationNote.includes(:created_by)
                                                                .filter_by(filter_params)
                                                                .order_by(order_params)
                                                                .paginate(page: params[:page], per_page: params[:per_page])

          render json: justification_notes, meta: { total: justification_notes.total_entries },
                 each_serializer: ::V3::External::JustificationNoteSerializer::List, adapter: :json, status: :ok
        end

        private

        def set_justifiable
          @justifiable = Justifiable.classify(params[:justifiable_type]).find(params[:justifiable_id])
        end

        def filter_params
          Justifiable.map_params(params.permit(:justifiable_type, :justifiable_id))
        end

        def order_params
          params.permit(:order, :direction)
        end
      end
    end
  end
end
