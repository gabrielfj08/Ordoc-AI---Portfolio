FactoryBot.define do
  factory :task_attachment_signature, class: 'Flow::TaskAttachmentSignature' do
    task_attachment { create(:task_attachment) }
    user { create(:user) }
    signature { JsonWebToken.encode({ task_attachment_id: task_attachment.id, user_id: user.id }) }
  end
end
