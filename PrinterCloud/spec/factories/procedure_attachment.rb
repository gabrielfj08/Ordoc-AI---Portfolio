FactoryBot.define do
  factory :procedure_attachment, class: 'Flow::ProcedureAttachment' do
    name { 'file.png' }
    procedure { create(:procedure) }
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
