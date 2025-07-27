module Flow
  class RefusingNotesController < BaseController
    before_action :set_refusing_note, only: [:show]
    load_ability :task_assignment, :refusing_note

    def show
      authorize! :read, @refusing_note
      render json: @refusing_note, serializer: RefusingNoteSerializer::Show, status: :ok
    end

    private

    def set_refusing_note
      @refusing_note = Flow::RefusingNote.find(params[:id])
    end

    def update_params
      params.require(:refusing_note).permit(:body)
    end
  end
end
