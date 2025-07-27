FactoryBot.define do
  factory :task_attachments, class: 'Flow::TaskAttachment' do
    name { 'file.png' }
    task { create(:task) }
    deleted_at { nil }

    after(:create) do |attachment|
      attachment.file.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'sample.pdf')),
        filename: 'file.png',
        content_type: 'application/pdf'
      )
    end
  end
end
