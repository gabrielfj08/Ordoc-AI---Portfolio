module FlowServices
  class ProcedureUnarchiver < ApplicationService
    attr_reader :procedure

    def initialize(params)
      @user = User.find(params[:user_id])
      @procedure = Flow::Procedure.find(params[:procedure_id])
      @archiving_notes_params = params[:archiving_notes_params]
    end

    def call
      ActiveRecord::Base.transaction do
        @procedure.unarchive!
        create_unarchiving_note
      end

      @procedure
    end

    def create_unarchiving_note
      Flow::ArchivingNote.create!(@archiving_notes_params.merge!(event_type: :unarchive))
    end
  end
end
