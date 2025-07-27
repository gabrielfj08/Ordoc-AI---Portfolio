module PrinterAirServices
  class DocumentVersionDestroyer < ApplicationService
    def initialize(id)
      @document_version = PrinterAir::Document.kept.find(id)
    end

    def call
      if @document_version.current?
        unless current_document.present?
          raise Error::CustomError.new(:unprocessable_entity, 422,
                                       I18n.t('activerecord.errors.messages.can_not_delete_current_version'))
        end

        @document_version.destroy!
        current_document.update(version_id: nil)
      else
        @document_version.destroy!
      end
    end

    private

    def current_document
      PrinterAir::Document.non_current.where(prn: prn).order(created_at: :desc).first
    end

    def prn
      @document_version.prn
    end
  end
end
