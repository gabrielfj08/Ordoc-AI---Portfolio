FactoryBot.define do
  factory :policy_attachment, class: 'PrinterCloud::PolicyAttachment' do
    policy_attachable { build(:user_group) }
    policy { build(:policy) }
  end
end
