FactoryBot.define do
  factory :procedure_attachment_signature, class: 'Flow::ProcedureAttachmentSignature' do
    procedure_attachment { create(:procedure_attachment) }
    user { create(:user) }
    signature { JsonWebToken.encode({ procedure_attachment_id: procedure_attachment.id, user_id: user.id }) }
  end
end
