module Flow
  class ArchivingNotesController < BaseController
    before_action :set_procedure, only: [:index]
    before_action :set_archiving_note, only: [:show]
    load_ability :procedure, :archiving_note

    def index
      authorize! :read, @procedure
      @archiving_notes = @procedure.archiving_notes.accessible_by(current_ability)

      render json: @archiving_notes, each_serializer: ArchivingNoteSerializer::List, status: :ok
    end

    def show
      authorize! :read, @archiving_note
      render json: @archiving_note, serializer: ArchivingNoteSerializer::Show, status: :ok
    end

    private

    def set_procedure
      @procedure = Flow::Procedure.kept.find(params[:procedure_id])
    end

    def set_archiving_note
      @archiving_note = Flow::ArchivingNote.find(params[:id])
    end

    def update_params
      params.require(:archiving_note).permit(:body)
    end
  end
end
