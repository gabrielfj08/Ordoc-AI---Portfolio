module Flow
  class ProcedureAttachment < ApplicationRecord
    include Discard::Model
    include Filterable
    include Orderable

    self.discard_column = :deleted_at

    validates :name, presence: true
    validates_length_of :procedure_attachment_signatures, maximum: 1
    before_destroy :must_not_be_signed

    before_discard do
      must_not_be_signed
    end

    has_one_attached :file
    has_many         :procedure_attachment_signatures, class_name: 'Flow::ProcedureAttachmentSignature'

    belongs_to :procedure

    scope :filter_by_department_id,   -> (department_id) { joins(procedure: :department).where(department: { id: department_id }) }
    scope :filter_by_organization_id, -> (organization_id) { joins(procedure: { department: :organization }).where(organization: { id: organization_id }) }
    scope :filter_by_procedure_id,    -> (procedure_id) { where(procedure_id: procedure_id) }
    scope :signed,                    -> { joins(:procedure_attachment_signatures).where(procedure_attachment_signatures: { status: :signed }) }

    def url
      Rails.application.routes.url_helpers.rails_blob_path(self.file.attachment, only_path: true) if self.file.attached?
    end

    private

    def must_not_be_signed
      raise Error::CannotDeleteAttachmentError if procedure_attachment_signatures.present?
    end

  end
end
