module FlowServices
  class ProcedureArchiver < ApplicationService
    attr_reader :procedure

    def initialize(params)
      @user = User.find(params[:user_id])
      @procedure = Flow::Procedure.kept.find(params[:procedure_id])
      @archiving_notes_params = params[:archiving_notes_params]
    end

    def call
      ActiveRecord::Base.transaction do
        create_archiving_note
        @procedure.archive!
      end

      @procedure
    end

    def create_archiving_note
      Flow::ArchivingNote.create!(@archiving_notes_params.merge!(event_type: :archive))
    end
  end
end
